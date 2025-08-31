import React from 'react';
import { FaBuilding, FaUser, FaMoneyBill } from 'react-icons/fa';
import '../styles/RenteaseDashboard.css';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="main-title">Welcome back, John!</h1>
      <p className="subtitle">Here’s what’s happening with your properties today.</p>

      {/* Summary Cards */}
      <div className="cards">
        <div className="card">
          <h2>Total Properties</h2>
          <p>24</p>
          <div className="card-icon blue"><FaBuilding /></div>
        </div>
        <div className="card">
          <h2>Active Tenants</h2>
          <p>18</p>
          <div className="card-icon green"><FaUser /></div>
        </div>
        <div className="card">
          <h2>Pending Rent Payments</h2>
          <p>3</p>
          <div className="card-icon orange"><FaMoneyBill /></div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <h2 className="table-title">Recent Maintenance Requests</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Property Name</th>
              <th>Issue</th>
              <th>Tenant</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sunset Apartments #12A</td>
              <td>Leaking faucet in kitchen</td>
              <td>Sarah Johnson</td>
              <td><span className="badge open">Open</span></td>
              <td>20/1/2025</td>
            </tr>
            <tr>
              <td>Oak Street House</td>
              <td>Heating system not working</td>
              <td>Michael Chen</td>
              <td><span className="badge inprogress">In Progress</span></td>
              <td>19/1/2025</td>
            </tr>
            <tr>
              <td>Downtown Loft #5B</td>
              <td>Broken window in bedroom</td>
              <td>Emily Davis</td>
              <td><span className="badge resolved">Resolved</span></td>
              <td>18/1/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
