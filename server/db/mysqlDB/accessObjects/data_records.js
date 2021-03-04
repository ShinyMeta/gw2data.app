


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
        // .then(() => {

        // })
        .catch((err) => {
          console.error(err)
        }) 
    },
    


    

    retrieveRecordsByUserId(user_id) {
      return DB('data_records')
        .where({user_id})
        .then((results) => {
          return results
        })
    },

    
    // retrieveRecordLines(record_id) {}, // maybe??
    retrieveRecordByRecordId(record_id) {
      return DB('data_records')
        .where({id: record_id})
        // .then((results) => {
        .then(([result]) => {
          if (result === undefined) { return null }

          return DB('data_record_lines')
            .where({data_record_id: record_id})
            .then((lines) => {
              // result = results[0]
              result.lines = lines
              return result
            })
        })
    },

    // editRecordMetadata(newRecord) {

    // },

    // editRecordLines(newLineAdjustments) {},







  }
}