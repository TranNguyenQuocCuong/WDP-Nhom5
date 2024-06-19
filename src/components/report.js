import React, { useState } from 'react';
import { Col, FloatingLabel, Form, Row, Button } from 'react-bootstrap';
import axios from 'axios';

const Report = () => {
  const [type, setType] = useState('');
  const [data, setData] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportData = { type, data };
      const response = await axios.post('http://localhost:5000/api/reports', reportData);
      alert('Report submitted successfully');
      setType('');
      setData('');
    } catch (error) {
      alert('Error submitting report: ' + error.response.data.error);
    }
  };

  return (
    <>
      <Form autoComplete="off" className="border border-primary rounded p-3 my-3 mx-auto" style={{ maxWidth: 600 }} onSubmit={handleSubmit}>
        <div className="text-primary text-center mb-4">
          <i className="fas fa-envelope" style={{ fontSize: 50 }}></i> {/* Replace with Bootstrap icon */}
          <h3 className="mt-3">Report Form</h3>
          <p className="text-primary-text">Make a report.</p>
        </div>

        <Row>
          <Col md>
            <FloatingLabel controlId="floatingType" label="Type" className="dense mb-3">
              <Form.Select name="type" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select type</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Others">Others</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>

        <FloatingLabel controlId="floatingData" label="Data" className="dense mb-3">
          <Form.Control as="textarea" placeholder="Data" name="data" style={{ height: 100 }} value={data} onChange={(e) => setData(e.target.value)} required />
        </FloatingLabel>

        <Button type="submit" color="primary" size="lg" className="d-block m-auto w-100">
          Send Report
        </Button>
      </Form>
    </>
  );
};

export default Report;
