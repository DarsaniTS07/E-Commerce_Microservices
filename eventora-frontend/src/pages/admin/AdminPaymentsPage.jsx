import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, DollarSign, Calendar, Activity } from "lucide-react";
import paymentService from "../../services/paymentService";
import orderService from "../../services/orderService";
import eventService from "../../services/eventService";
import { cn } from "../../utils/cn";

export const AdminPaymentsPage = () => {
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: paymentService.getAllPayments,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: orderService.getAllOrders,
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => eventService.listEvents({ limit: 100 }),
  });
  
  const events = eventsData?.events || [];

  const isLoading = paymentsLoading || ordersLoading || eventsLoading;

  const { totalRevenue, revenueByEvent } = useMemo(() => {
    let total = 0;
    const eventRevenueMap = {};

    if (!paymentsLoading && !ordersLoading && !eventsLoading) {
      // Create a map of orderId -> eventId
      const orderToEventMap = {};
      orders.forEach(order => {
        orderToEventMap[order.orderId] = order.eventId;
      });

      // Create a map of eventId -> event title
      const eventIdToTitleMap = {};
      events.forEach(event => {
        eventIdToTitleMap[event.id] = event.title;
      });

      payments.forEach(payment => {
        if (payment.paymentStatus === 'SUCCESS') {
          total += payment.amount;
          
          const eventId = orderToEventMap[payment.orderId];
          if (eventId) {
            const title = eventIdToTitleMap[eventId] || 'Unknown Event';
            if (!eventRevenueMap[eventId]) {
              eventRevenueMap[eventId] = { title, revenue: 0, count: 0 };
            }
            eventRevenueMap[eventId].revenue += payment.amount;
            eventRevenueMap[eventId].count += 1;
          }
        }
      });
    }

    return { 
      totalRevenue: total, 
      revenueByEvent: Object.values(eventRevenueMap).sort((a, b) => b.revenue - a.revenue)
    };
  }, [payments, orders, events, paymentsLoading, ordersLoading, eventsLoading]);

  return (
    <div className="p-3 md:p-4 lg:p-6 space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-primary">Payments & Revenue</h1>
        <p className="text-sm text-neutral-secondary mt-1">Overview of all payments and generated revenue.</p>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-neutral-secondary">Loading payment data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <DollarSign size={32} />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-secondary uppercase tracking-wider">Overall Revenue</p>
                <h2 className="text-3xl font-black text-neutral-primary">₹{totalRevenue.toLocaleString()}</h2>
              </div>
            </div>

            <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <CreditCard size={32} />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-secondary uppercase tracking-wider">Total Payments</p>
                <h2 className="text-3xl font-black text-neutral-primary">{payments.length}</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue by Event */}
            <div className="bg-neutral-white p-6 rounded-[24px] border border-neutral-muted shadow-sm lg:col-span-1 h-fit">
              <h3 className="text-lg font-bold text-neutral-primary mb-4 flex items-center gap-2">
                <Activity size={20} className="text-primary"/> Revenue by Event
              </h3>
              {revenueByEvent.length === 0 ? (
                <p className="text-sm text-neutral-secondary text-center py-4">No revenue generated yet.</p>
              ) : (
                <div className="space-y-4">
                  {revenueByEvent.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-neutral-muted bg-neutral-lightest/50">
                      <div>
                        <p className="font-bold text-sm text-neutral-primary line-clamp-1">{item.title}</p>
                        <p className="text-xs text-neutral-secondary">{item.count} successful payments</p>
                      </div>
                      <p className="font-black text-emerald-600">₹{item.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payments List */}
            <div className="bg-neutral-white rounded-[24px] border border-neutral-muted shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-neutral-muted">
                <h3 className="text-lg font-bold text-neutral-primary flex items-center gap-2">
                  <CreditCard size={20} className="text-primary"/> All Payments
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-muted bg-neutral-lightest/50">
                      <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Payment ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-muted">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-neutral-secondary text-sm">No payments found.</td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.paymentId} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs font-mono text-neutral-secondary">
                            {payment.paymentId.substring(0, 13)}...
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-neutral-secondary">
                            {payment.orderId.substring(0, 13)}...
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-neutral-primary">
                            ₹{payment.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                              payment.paymentStatus === 'SUCCESS' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                              payment.paymentStatus === 'PENDING' ? "bg-amber-50 text-amber-600 border-amber-200" :
                              payment.paymentStatus === 'REFUNDED' ? "bg-blue-50 text-blue-600 border-blue-200" :
                              "bg-red-50 text-red-600 border-red-200"
                            )}>
                              {payment.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-neutral-secondary flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
