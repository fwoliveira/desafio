import React, { useState } from "react";
import api from '../../services/api';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export function alterPassawordForms() {
    const [user, setUser] = useState({
      id: '',
      email: '',
      passwordtoken:'',
      password1: '',
      password2: ''
    })
  
    const [status, setStatus] = useState({
      type: '',
      mensagem: '',
      loading: false
    })
  
    const valorInput = e => setUser({ 
      ...user, 
      [e.target.name]: e.target.value
    })

    function validate(){
      if(user.password1 !== user.password2){
        return setStatus({
          type: 'error',
          mensagem: 'senhas diferntes'
        })

        }
      }
   
  
    const recoverySubmit = async e => {
      e.preventDefault(); 
      setStatus({
        loading:true,
      })
  
      const headers = {
        'Content-Type': 'application/json'
      }
  
      await api.post("/users/alterpassword", user, {headers})
      .then((response) => {
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
      })
    }
    
 return (
    <>
    <div className="box">
       
         {/* <Container className="box"> */}
  <Form  className="borderForm" onSubmit={recoverySubmit}>
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
        value={user.email}
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="formBasicDescripition">
      <Form.Label className="FormLabel"> Token: </Form.Label>
      <Form.Control
        type="text"
        name="passwordtoken"
        value={user.passwordtoken}
        onChange={valorInput}
        placeholder="Token"
        
      />
    </Form.Group >
    <Form.Group className="mb-3" controlId="formBasicDescripition" >
      <Form.Label className="FormLabel"> Nova Senha: </Form.Label>
      <Form.Control
        type="password"
        name="password"
        onChange={valorInput}
        placeholder="Nova Senha"
        
      />
    </Form.Group>
    <Form.Group className="mb-3" controlId="formBasicDescripition" >
      <Form.Label className="FormLabel"> Confirme sua Senha: </Form.Label>
      <Form.Control
       
        type="password"
        name="password2"
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