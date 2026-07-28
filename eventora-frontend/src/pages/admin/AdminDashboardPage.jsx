import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { DollarSign, Calendar, Users, ShoppingCart } from "lucide-react";
import userService from "../../services/userService";
import eventService from "../../services/eventService";
import orderService from "../../services/orderService";
import paymentService from "../../services/paymentService";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const AdminDashboardPage = () => {
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-dash"],
    queryFn: userService.listUsers,
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["admin-events-dash"],
    queryFn: () => eventService.listEvents({ limit: 100, status: "" }),
  });
  
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders-dash"],
    queryFn: orderService.getAllOrders,
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-payments-dash"],
    queryFn: paymentService.getAllPayments,
  });

  const events = eventsData?.events || [];
  const isLoading = usersLoading || eventsLoading || ordersLoading || paymentsLoading;

  // Process data for charts
  const { totalRevenue, revenueData, ticketsData, statusData } = useMemo(() => {
    let totalRev = 0;
    
    // Revenue over time
    const revMap = {};
    payments.forEach(p => {
      if (p.paymentStatus === 'SUCCESS') {
        totalRev += p.amount;
        const date = new Date(p.createdAt).toLocaleDateString();
        revMap[date] = (revMap[date] || 0) + p.amount;
      }
    });
    const revChartData = Object.keys(revMap).map(date => ({ date, revenue: revMap[date] }));

    // Tickets sold per event (from CONFIRMED orders)
    const ticketsMap = {};
    const orderToEventMap = {};
    orders.forEach(o => {
      if (o.status === 'CONFIRMED') {
        ticketsMap[o.eventId] = (ticketsMap[o.eventId] || 0) + o.quantity;
      }
    });

    const eventTitleMap = {};
    events.forEach(e => { eventTitleMap[e.id] = e.title; });

    const ticketChartData = Object.keys(ticketsMap).map(eventId => ({
      name: eventTitleMap[eventId] || 'Unknown',
      tickets: ticketsMap[eventId]
    }));

    // Event status distribution
    const statusMap = {};
    events.forEach(e => {
      statusMap[e.status] = (statusMap[e.status] || 0) + 1;
    });
    const statusChartData = Object.keys(statusMap).map(status => ({
      name: status,
      value: statusMap[status]
    }));

    return {
      totalRevenue: totalRev,
      revenueData: revChartData,
      ticketsData: ticketChartData,
      statusData: statusChartData,
    };
  }, [payments, orders, events]);

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-secondary">Loading dashboard analytics...</div>;
  }

  return (
    <div className="p-3 md:p-4 lg:p-6 space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-primary">Platform Overview</h1>
        <p className="text-sm text-neutral-secondary mt-1">Key metrics and analytics across the entire platform.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">Total Revenue</p>
              <h2 className="text-2xl font-black text-neutral-primary">₹{totalRevenue.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">Total Users</p>
              <h2 className="text-2xl font-black text-neutral-primary">{users.length}</h2>
            </div>
          </div>
        </div>

        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">Total Events</p>
              <h2 className="text-2xl font-black text-neutral-primary">{events.length}</h2>
            </div>
          </div>
        </div>

        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <ShoppingCart size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-secondary uppercase tracking-wider">Total Orders</p>
              <h2 className="text-2xl font-black text-neutral-primary">{orders.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Line Chart */}
        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
          <h3 className="text-lg font-bold text-neutral-primary mb-6">Revenue Over Time</h3>
          <div className="h-72 w-full">
            {revenueData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-neutral-secondary">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tickets Sold Bar Chart */}
        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm">
          <h3 className="text-lg font-bold text-neutral-primary mb-6">Tickets Sold by Event</h3>
          <div className="h-72 w-full">
            {ticketsData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-neutral-secondary">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsData} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tick={{ angle: -45, textAnchor: 'end', dy: 10 }} height={60} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="tickets" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Event Status Pie Chart */}
        <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-neutral-primary mb-6">Event Status Distribution</h3>
          <div className="h-72 w-full flex justify-center">
            {statusData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-neutral-secondary">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
