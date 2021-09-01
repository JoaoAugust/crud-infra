const mysql = require('mysql');


let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});


exports.view = (req, res) => {
  
  connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {
    
    if (!err) {
      let removedUser = req.query.removed;
      res.render('home', { rows, removedUser });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


exports.find = (req, res) => {
  let searchTerm = req.body.search;
  
  connection.query('SELECT * FROM user WHERE peimeiro_nome LIKE ? OR segundo_nome LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
    if (!err) {
      res.render('home', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}

exports.form = (req, res) => {
    res.render('add-user');
  }
  
  
  exports.create = (req, res) => {
    const { primeiro_nome, segundo_nome, email, telefone, comments} = req.body;
    let searchTerm = req.body.search;
  
    
    connection.query('INSERT INTO user SET primeiro_nome = ?, segundo_nome= ?, email = ?, telefone = ?, comments = ?', [primeiro_nome, segundo_nome, email, telefone, comments], (err, rows) => {
      if (!err) {
        res.render('add-user', { alert: 'Cliente adicionado com sucesso.' });
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', rows);
    });
  }
  



exports.edit = (req, res) => {
  
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('edit-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}



exports.update = (req, res) => {
  const { primeiro_nome, segundo_nome, email, telefone, comments } = req.body;
  
  connection.query('UPDATE user SET primeiro_nome = ?, segundo_nome = ?, email = ?, telefone = ?, comments = ? WHERE id = ?', [primeiro_nome, segundo_nome, email, telefone, comments, req.params.id], (err, rows) => {

    if (!err) {
     
      connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
        
        
        if (!err) {
          res.render('edit-user', { rows, alert: `${primeiro_nome} has been updated.` });
        } else {
          console.log(err);
        }
        console.log('The data from user table: \n', rows);
      });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });
}


exports.delete = (req, res) => {

  

  connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', req.params.id], (err, rows) => {
    if (!err) {
      let removedUser = encodeURIComponent('User successeflly removed.');
      res.redirect('/?removed=' + removedUser);
    } else {
      console.log(err);
    }
    console.log('The data from beer table are: \n', rows);
  });

}


exports.viewall = (req, res) => {

  
  connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => {
    if (!err) {
      res.render('view-user', { rows });
    } else {
      console.log(err);
    }
    console.log('The data from user table: \n', rows);
  });

}