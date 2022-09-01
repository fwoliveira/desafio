import React, { useState, useContext, useEffect } from "react";
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export function alterPassawordForms() {
    const history = useHistory();  
  
    
  
    const [user, setUser] = useState({
      email: '',
      passwordtoken:'',
      password: ''
    })
  
    const [status, setStatus] = useState({
      type: '',
      mensagem: '',
      loading: false
    })
  
   
    const valorInput = e => setValues({
      ... values,
      [e.target.email]: e.target.value
  })
  
    const loginSubmit = async e => {
  
      e.preventDefault();
  
      // console.log(user.email);
      // console.log(user.password);
      
      setStatus({
        loading:true,
      })
  
      const headers = {
        'Content-Type': 'application/json'
        // 'Content-Type':'application/x-www-form-urlencoded'
      }
  
      await api.post("/users/alterpassword", user, {headers})
      .then((response) => {
        // console.log(response);
        setStatus({
          type: 'success',
          mensagem: response.data.mensagem
        })
  
      }).catch((err) => {
        setStatus({
            type: 'error',
            mensagem: 'Erro: tente mais tarde...'
        })
        if(err.response){
          // console.log(err.response);
          setStatus({
            type: 'error',
            mensagem: err.response.data.mensagem,
            loading: false
          })
        }
        // console.log("Erro: tente mais tarde...");  
      })
    }

    
 return (
    <>
    <div className="box">
       
         {/* <Container className="box"> */}
  <Form  className="borderForm" onSubmit={loginSubmit}>
    {status.type == 'error'? <p>{status.mensagem}</p>: ""}
  {status.type == 'success'? <p>{status.mensagem}</p>: ""}
  {status.loading ? <p>Enviando</p>: ""}
    <div className="user">
     
    </div>
    <Form.Group className="mb-3" controlId="formBasicName" >
      <Form.Label>Email:</Form.Label>
      <Form.Control
        type="email"
        name="email"
        onChange={valorInput}
        placeholder="Email"
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicDescripition">
      <Form.Label className="FormLabel"> Token: </Form.Label>
      <Form.Control
        
        type="text"
        name="token"
        onChange={valorInput}
        placeholder="Token"
      />
    </Form.Group >
    <Form.Group className="mb-3" controlId="formBasicDescripition" >
      <Form.Label className="FormLabel"> Nova Senha: </Form.Label>
      <Form.Control
       
        type="text"
        name="passaword"
        onChange={valorInput}
        placeholder="Nova Senha"
      />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicDescripition" >
      <Form.Label className="FormLabel"> Confirme sua Senha: </Form.Label>
      <Form.Control
       
        type="text"
        name="passaword2"
        onChange={valorInput}
        placeholder="Confirme sua senha"
      />
    </Form.Group>
    {status.loading 
    ? <Button variant="dark" disabled type="submit">Enviando</Button>
    : <Button variant="dark"  type="submit" >Enviar</Button>}
   
  </Form>
  {/* </Container> */}
    </div>
    </>
)
}