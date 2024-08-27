const db = require('../connection')
const format = require('pg-format')

exports.checkExists = (table_name, column_name, value) => {
  const queryString = format(
    "SELECT * FROM %I WHERE %I = $1",
    table_name,
    column_name
  )
  // console.log(queryString, "<--- QS")
  // console.log(value, "<--- value")
  return db.query(queryString, [value]).then(({rows}) =>{
    if (rows.length === 0){
      return Promise.reject({message: "not found"})
    }
  })
}

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};
