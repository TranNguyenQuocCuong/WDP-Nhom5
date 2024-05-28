import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const forgotPassword = () => {
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setShowAlert(true);
  };

  return (
    <Container>
      <Row className="justify-content-center mt-5">S
        <Col md={6}>
          <h2 className="text-center mb-4">Quên mật khẩu</h2>
          {showAlert && (
            <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
              Email đã được gửi để đặt lại mật khẩu.
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email đã đăng ký"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Gửi
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default forgotPassword;
