


module.exports = (DB) => {
  //returns an object that has access function
  return {
    //create record and lines from object
    create(data_record) {
      const newRecord = {
        user_id: data_record.user_id,
        gw2_account_name: data_record.gw2_account_name,
        start_time: new Date(data_record.start_time),
        end_time: new Date(data_record.end_time),
        status: 'saved', //other statuses: edited, 
        description: data_record.description,
        details: data_record.details,
        primary_tag: data_record.primary_tag,
        primary_element_id: data_record.primary_element_id,
        primary_element_type: data_record.primary_element_type,
      }

      return DB('data_records')
        .insert(newRecord)
        .then((id) => {
          return DB('data_record_lines')
            .insert(
              data_record.lines.map((line) => {
                return {
                  data_record_id: id,
                  quantity: line.quantity,
                  element_id: line.element_id,
                  element_type: line.element_type,
                  upgrades: line.upgrades,
                }
              })
            )
            .then((line_ids) => {
              return id
            })
        })
        .then((data_record_id) => {
          return this.saveRecordTags(data_record_id, data_record.tags, data_record.user_id)
            .then(() => data_record_id)
        })
        .catch((err) => {
          console.error(err)
        }) 
    },

    
    update(data_record) {
      const recordToUpdate = {
        // user_id: data_record.user_id,
        // gw2_account_name: data_record.gw2_account_name,
        // start_time: new Date(data_record.start_time),
        // end_time: new Date(data_record.end_time),
        // status: 'saved', //other statuses: edited, 
        description: data_record.description,
        details: data_record.details,
        primary_tag: data_record.primary_tag,
        primary_element_id: data_record.primary_element_id,
        primary_element_type: data_record.primary_element_type,
      }

      return DB('data_records')
        .where({id: data_record.id})
        .update(recordToUpdate)
        // .then((id) => {
        //   return DB('data_record_lines')
        //     .insert(
        //       data_record.lines.map((line) => {
        //         return {
        //           data_record_id: id,
        //           quantity: line.quantity,
        //           element_id: line.element_id,
        //           element_type: line.element_type,
        //           upgrades: line.upgrades,
        //         }
        //       })
        //     )
        //     .then((line_ids) => {
        //       return id
        //     })
        // })
        .then(() => {
          return this.saveRecordTags(data_record.id, data_record.tags, data_record.user_id)
            .then(() => data_record.id)
        })
        .catch((err) => {
          console.error(err)
        }) 
    },
    
    async newCustomTag(name, user_id) {
      //look for an existing tag
      let customTag = await DB('custom_tags')
        .where({user_id, name})
        .first()

      if (!customTag) {
        customTag = {name, user_id}
        customTag.id = await DB('custom_tags')
          .insert({name, user_id})
      }

      return customTag
    },

    async getCustomTags(user_id) {
      return DB('custom_tags').where({user_id})
    },

    async deleteCustomTag(name, user_id) {
      // ensure no records have this as primary tag
      return DB('data_record_tags')
        // .join('data_records', {'data_records.id': 'data_record_tags.data_record_id'})
        // .where({'data_records.primary_tag':name})
        .whereIn('data_record_id', 
          DB('data_records').select('id').where({user_id, primary_tag: name})
        )
        .then((records) => {
          if (records.length > 0) {
            throw new Error('This tag is used as primary on at least one record')
          }
          return records
        })
        .then(() => {
          return DB('data_record_tags')
          // .join('data_records', {'data_records.id': 'data_record_tags.data_record_id'})
          .where({name})
          .whereIn('data_record_id', 
            DB('data_records').select('id').where({user_id})
          )
          .del()
        })
        .then(() => {
          return DB('custom_tags').where({name, user_id})
          .del()
        })

    },
    
    async saveRecordTags(data_record_id, tagList, user_id) {
      //first delete all tags for the record
      await DB('data_record_tags').where({data_record_id}).del()
      //if any tags in taglist have id:'new', try to add them
      const newTags = tagList.filter(x => x.id==='new')
      await Promise.all(newTags.map(x => DB('custom_tags')
        .insert({name: x.name, user_id})))
      //then add them to data_record_tags table
      return Promise.all(tagList.map(x => DB('data_record_tags')
        .insert({name: x.name, data_record_id})))
    },

    async myTags(user_id) {
      return DB('data_records')
        .select(DB.raw('custom_tags.name, count(data_record_tags.id) AS count, sum(case when data_records.primary_tag = custom_tags.name then 1 else 0 end) as primaryCount'))
        .leftJoin('data_record_tags', {'data_records.id': 'data_record_tags.data_record_id'})
        .join('custom_tags', {'data_record_tags.name': 'custom_tags.name'})
        .where({'custom_tags.user_id':user_id})
        .groupBy('custom_tags.name')
        .then((results) => {
          return results.map(x => {
            if (x.tags) {
              x.tags = JSON.parse(x.tags)
            }
            return x
          })
        })
    },



    

    retrieveRecordsByUserId(user_id) {
      return DB('data_records')
        .select(DB.raw('data_records.*, JSON_ARRAYAGG(data_record_tags.name) AS tags'))
        .leftJoin('data_record_tags', {'data_records.id': 'data_record_tags.data_record_id'})
        .where({user_id})
        .groupBy('data_records.id')
        .then((results) => {
          return results.map(x => {
            if (x.tags) {
              x.tags = JSON.parse(x.tags)
            }
            return x
          })
        })
    },

    
    // retrieveRecordLines(record_id) {}, // maybe??
    retrieveRecordByRecordId(record_id) {
      return DB('data_records')
        .where({id: record_id})
        .first()
        .then((result) => {
          if (result === undefined) { return null }

          return DB('data_record_lines')
            .where({data_record_id: record_id})
            .then((lines) => {
              // result = results[0]
              result.lines = lines
              return result
            })
        })
        .then((result) => {
          if (result === undefined || result === null) { return null }

          return DB('data_record_tags')
            .where({data_record_id: record_id})
            .then((tags) => {
              // result = results[0]
              result.tags = tags
              return result
            })
        })
    },

    // editRecordMetadata(newRecord) {

    // },

    // editRecordLines(newLineAdjustments) {},







  }
}