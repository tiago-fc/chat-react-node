import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./SendMessageForm.css";

function SendMessageForm({sendMessage})  {
    
    const [message, setMessage] = useState('');

    const handleChange = (evt) => {
        setMessage(evt.target.value);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      sendMessage(message);
      setMessage('');
    }

    const handleKeyPress = (e) => {
        
      if(e.charCode === 13){
        e.preventDefault();
        sendMessage(message);
        setMessage('');  
      } 
    }

    return (
        <div className="send-message-form">
        <Form noValidate style={{ marginTop: "20px" }}>
        <Form.Row>
          <Form.Group as={Col} xs={10} md={10} lg={10} controlId="handle" >
            <Form.Label>Mensagem (Para enviar clique no botão abaixo ou aperte ENTER)</Form.Label>
            <Form.Control
              type="text"
              name="message"
              placeholder="Escreva sua mensagem"
              value={message}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />

          </Form.Group>
          <Form.Group as={Col} xs={2} md={2} lg={2} style={{alignSelf: 'flex-end'}} controlId="handle">
            <Button type="button" onClick={handleSubmit}  style={{ marginRight: "10px" }}>
                Enviar
            </Button>
          </Form.Group>
        </Form.Row>
        
      </Form>
      </div>
    )
    
  }

  export default SendMessageForm;