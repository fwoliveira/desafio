import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './styles.css';
import api from '../../services/api';

export function enviarEmail() {
  const [user, setUser] = useState({
    email: '',
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

  const recoverySubmit = async e => {

    e.preventDefault();
    setStatus({
      loading:true,
    })

    const headers = {
      'Content-Type': 'application/json'
      // 'Content-Type':'application/x-www-form-urlencoded'
    }

    await api.post("/users/recovery", user, {headers})
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
    })
  }
  return (
    <div className="box">
      
      {/* <Container className="box"> */}
      <Form onSubmit={recoverySubmit} className="borderForm">
        <h1>Alterar senha</h1>
        {status.type == 'error'? <p>{status.mensagem}</p>: ""}
      {status.type == 'success'? <p>{status.mensagem}</p>: ""}
      {status.loading ? <p>Validando</p>: ""}
        <div className="user">
          
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="FormLabel">
           Endereço de Email:
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={valorInput}
            placeholder="Digite seu e-mail "
          />
        </Form.Group>
       
        {status.loading 
        ? <Button variant="dark" disabled type="submit">enviando</Button>
        : <Button variant="dark"  type="submit">enviar</Button>}
       
      </Form>
      {/* </Container> */}
    </div>
  );
}