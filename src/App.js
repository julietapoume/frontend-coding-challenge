import React, { useState, useEffect } from 'react';
import { Service } from './Service';

function App() {

  //Populate the list with data from `Service.getTenants`.
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(false);
  const fetchTenantsData = async () => {
    try {
      const data = await Service.getTenants();
      setTenants(data);
    } catch (e) {
      setError(true);
    }
  };
  useEffect(() => {
    fetchTenantsData();
  }, []);

  return (
    <>
      <div className="container">
        <h1>Tenants</h1>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#">All</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Payment is late</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Lease ends in less than a month</a>
          </li>
        </ul>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Payment Status</th>
              <th>Lease End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              tenants.map((tenant) =>
                <tr key={tenant.id}>
                  <th> {tenant.id} </th>
                  <td> {tenant.name} </td>
                  <td> {tenant.paymentStatus} </td>
                  <td> {new Date(tenant.leaseEndDate).toISOString().split('T')[0]} </td>
                  <td>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className="container">
        <button className="btn btn-secondary">Add Tenant</button>
      </div>
      <div className="container">
        <form>
          <div className="form-group">
            <label>Name</label>
            <input className="form-control" />
          </div>
          <div className="form-group">
            <label>Payment Status</label>
            <select className="form-control">
              <option>CURRENT</option>
              <option>LATE</option>
            </select>
          </div>
          <div className="form-group">
            <label>Lease End Date</label>
            <input className="form-control" />
          </div>
          <button className="btn btn-primary">Save</button>
          <button className="btn">Cancel</button>
        </form>
        {error &&
          <span>
            Error loading data, please refresh the page.
          </span>
        }
      </div>
    </>
  );
}

export default App;
