import React, { useState, useEffect } from 'react';
import { Service } from './Service';

const Filter = {
  status: 'status',
  date: 'date',
};

const PaymentStatus = {
  current: 'CURRENT',
  late: 'LATE',
};

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

  //Ability to filter the list
  const [filter, setFilter] = useState();
  const filterByPaymentStatus = (status) => {
    return tenants.filter((tenant => tenant.paymentStatus === status));

  };
  const filterByMonth = () => {
    const subtractDays = (date, days) => {
      date.setDate(date.getDate() + days);
      return date;
    };
    const d = new Date();
    var lastMonth = subtractDays(d, -30);
    return tenants.filter((tenant => new Date(tenant.leaseEndDate) > lastMonth));
  };
  const getTenantsFiltered = () => {
    switch (filter) {
      case Filter.status:
        return filterByPaymentStatus(PaymentStatus.late);
      case Filter.date:
        return filterByMonth();
      default:
        return tenants;
    }
  };

  //Ability to sort the list
  const sortTenants = (propName) => {
    let sortedTenants = [...tenants];
    sortedTenants = sortedTenants.sort((a, b) => (a[propName] > b[propName]) ? 1 : -1);
    setTenants(sortedTenants);
  }

  //Ability to add a tenant
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('CURRENT');
  const date = new Date().toISOString().split('T')[0];
  const [leaseEndDate, setLeaseEndDate] = useState(date);
  const saveTenantData = async (name, paymentStatus, leaseEndDate) => {
    try {
      await Service.addTenant({ name, paymentStatus, leaseEndDate });
      fetchTenantsData();
      setShowForm(false);
    } catch (e) {
      alert('Error adding a new tenant, try again please');
    }
  };

  //Ability to delete a tenant
  const deleteTenant = async (id) => {
    try {
      await Service.deleteTenant(id);
      fetchTenantsData();
    } catch (e) {
      alert('Error deleting tenant id, try again please ', e);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Tenants</h1>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className="nav-link active"
              onClick={() => setFilter()}
            >
              All
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => setFilter(Filter.status)}
            >
              Payment is late
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => setFilter(Filter.date)}
            >
              Lease ends in less than a month
            </button>
          </li>
        </ul>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => sortTenants("name")}>Name</th>
              <th onClick={() => sortTenants("paymentStatus")}>Payment Status</th>
              <th onClick={() => sortTenants("leaseEndDate")}>Lease End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              getTenantsFiltered().map((tenant) =>
                <tr key={tenant.id}>
                  <th> {tenant.id} </th>
                  <td> {tenant.name} </td>
                  <td> {tenant.paymentStatus} </td>
                  <td> {new Date(tenant.leaseEndDate).toISOString().split('T')[0]} </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteTenant(tenant.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
      <div className="container">
        <button
          className="btn btn-secondary"
          onClick={() => setShowForm(true)}
        >
          Add Tenant
        </button>
      </div>
      <div className="container">
        {showForm &&
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
        }
        <div>
          {error &&
            <span>
              Error loading data, please refresh the page.
            </span>
          }
        </div>
      </div>
    </>
  );
}

export default App;
