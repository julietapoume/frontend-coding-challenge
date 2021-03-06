import React, { useState, useEffect } from 'react';
import { Service } from './Service';
import TenantForm from './TenantForm';

const Filter = {
  all: 'all',
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

  const getActiveTag = () => {
    switch (filter) {
      case Filter.status:
        return Filter.status;
      case Filter.date:
        return Filter.date;
      default:
        return Filter.all;
    }
  }

  //Ability to sort the list
  const sortTenants = (propName) => {
    let sortedTenants = [...tenants];
    sortedTenants = sortedTenants.sort((a, b) => (a[propName] > b[propName]) ? 1 : -1);
    setTenants(sortedTenants);
  }

  //Ability to add a tenant
  const [showForm, setShowForm] = useState(false);
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
              className={getActiveTag() === Filter.all ? ' nav-link active' : 'nav-link'}
              onClick={() => setFilter()}
            >
              All
            </button>
          </li>
          <li className="nav-item">
            <button
              className={getActiveTag() === Filter.status ? ' nav-link active' : 'nav-link'}
              onClick={() => setFilter(Filter.status)}
            >
              Payment is late
            </button>
          </li>
          <li className="nav-item">
            <button
              className={getActiveTag() === Filter.date ? ' nav-link active' : 'nav-link'}
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
        <TenantForm
          showForm={showForm}
          setShowForm={setShowForm}
          saveTenantData={saveTenantData}
        />
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
