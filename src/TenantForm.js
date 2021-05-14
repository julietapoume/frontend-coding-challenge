import React, { useState } from 'react';

const TenantForm = ({showForm, setShowForm, saveTenantData}) => {
  const [name, setName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('CURRENT');
  const date = new Date().toISOString().split('T')[0];
  const [leaseEndDate, setLeaseEndDate] = useState(date);
  
  return ( showForm &&
    <div className="container">
      <form>
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            maxLength="25"
            onChange={(event) => { setName(event.target.value) }}
          />
        </div>
        <div className="form-group">
          <label>Payment Status</label>
          <select
            className="form-control"
            onChange={(event) => { setPaymentStatus(event.target.value) }}
          >
            <option>CURRENT</option>
            <option>LATE</option>
          </select>
        </div>
        <div className="form-group">
          <label>Lease End Date</label>
          <input
            className="form-control"
            type="date"
            min={date}
            defaultValue={date}
            onChange={(event) => { setLeaseEndDate(event.target.value) }}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={(event) => {
            event.preventDefault();
            saveTenantData(name, paymentStatus, leaseEndDate)
          }}> Save </button>
        <button
          className="btn"
          onClick={(event) => {
            event.preventDefault();
            setShowForm(false);
          }}> Cancel </button>
      </form>
    </div>);
};

export default TenantForm;