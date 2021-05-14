


module.exports = (DB) => {
  //returns an object that has access function
  return {
    //create record and lines from object
    async create(summaryReport, user_id) {
      const newReport = {
        user_id,
        name: summaryReport.name,
        // start_date: new Date(summaryReport.startDate),
        // end_date: new Date(summaryReport.endDate),
        start_date: summaryReport.start_date?new Date(summaryReport.start_date):null,
        end_date: summaryReport.end_date?new Date(summaryReport.end_date):null,
        element_id: summaryReport.element_id,
        element_type: summaryReport.element_type,
        // element_list: JSON.stringify(summaryReport.elementList),
        // tag_list: JSON.stringify(summaryReport.tagList),
      }

      return DB('summary_reports')
        .insert(newReport)
        .then((report_id) => {
          return this.saveReportTags(report_id, summaryReport.tagList, user_id)
            .then(() => report_id)
        })
        
    },

    
    update(editedReport, user_id) {
      const reportChanges = {
        name: editedReport.name,
        start_date: editedReport.startDate?new Date(editedReport.startDate):null,
        end_date: editedReport.endDate?new Date(editedReport.endDate):null,
        // description: editedReport.description,
        // details: editedReport.details,
        // tag_list: editedReport.tagList,
        element_id: editedReport.elementId,
        element_type: editedReport.elementType,
        // element_list: editedReport.elementList,
      }

      return DB('summary_reports')
        .where({id: editedReport.id, user_id})
        .update(reportChanges)
        .then(() => {
          return this.saveReportTags(editedReport.id, editedReport.tagList, user_id)
            .then(() => editedReport.id)
        })
        .catch((err) => {
          console.error(err)
        }) 
    },

    async saveReportTags(report_id, tagList, user_id) {
      //first delete all tags for the record
      await DB('summary_report_tags').where({report_id}).del()
      //if any tags in taglist have id:'new', try to add them
      const newTags = tagList.filter(x => x.id==='new')
      await Promise.all(newTags.map(x => DB('custom_tags')
        .insert({name: x.name, user_id})))
      //then add them to summary_reports_tags table
      return Promise.all(tagList.map(x => DB('summary_report_tags')
        .insert({name: x.name, report_id})))
    },


    async getAllReports(user_id) {
      return DB('summary_reports')
        .select(DB.raw('summary_reports.*, JSON_ARRAYAGG(summary_report_tags.name) AS tags'))
        .leftJoin('summary_report_tags', {'summary_reports.id': 'summary_report_tags.report_id'})
        .where({user_id})
        .groupBy('summary_reports.id')
        .then((results) => {
          return results.map(x => {
            if (x.tags) {
              x.tags = JSON.parse(x.tags)
            }
            return x
          })
        })
    },
    
    async getByReportId(report_id, user_id) {
      const report = await DB('summary_reports')
        .where({user_id, id: report_id})
        .first()

      report.tagList = await DB('summary_report_tags')
        .where({report_id: report.id})

      //now get all records which match the tag list
      
      let dataRecordsQuery = DB('data_records')
        .select(DB.raw('data_records.*'))
        .join('data_record_tags', {'data_records.id': 'data_record_tags.data_record_id'})
        .whereIn('name', 
          DB('summary_report_tags').select('name').where({report_id: report.id})
        )
        .andWhere({'data_records.user_id': user_id})
        .andWhere({
          primary_element_id: report.element_id,
          primary_element_type: report.element_type,
        })
      if (report.start_date) {
        dataRecordsQuery = dataRecordsQuery
          .andWhere('data_records.start_time', '>', new Date(report.start_date))
      }
      if (report.end_date) {
        dataRecordsQuery = dataRecordsQuery
          .andWhere('data_records.end_time', '<', new Date(report.end_date))
      }
      
      dataRecordsQuery = dataRecordsQuery
        .groupBy('data_records.id')
        .havingRaw('count(name) = ?', report.tagList.length)



      const tagsQuery = DB('data_record_tags')
        .select(DB.raw('data_record_id, JSON_ARRAYAGG(data_record_tags.name) AS tags'))
        .whereIn('data_record_id', 
          DB('data_records').select('id').where({user_id})
        )
        .groupBy('data_record_id')
        

      const dataRecords = await DB.select('*')
        .from(dataRecordsQuery.as('a'))
        .join(tagsQuery.as('b'), 
          {'a.id' : 'b.data_record_id'})
        

        
        
        // .groupBy('data_records.id')
        // .havingRaw('count(name) = ?', report.tagList.length)
      
      const dataRecordLines = await DB('data_record_lines')
        .whereIn('data_record_id', dataRecords.map(x=>x.id))

      report.dataRecords = dataRecords      
      report.dataRecordLines = dataRecordLines      
          
      return report
    }
  }
}


// class summaryReport {
//   constructor(props) {
//     this.userId = props.userId || props.user_id,
//     this.name = props.name,
//     this.startDate = props.startDate || props.start_date,
//     this.endDate = props.endDate || props.end_date,
//     this.elementId = props.elementId || props.element_id,
//     this.elementType = props.elementType || props.element_type,
//     this.tagList = props.tagList || []
//   }
// } 