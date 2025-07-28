import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const queryClient = useQueryClient();

  // ✅ Fetch Bookings
  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/bookings");
      return res.json();
    },
  });

  // ✅ Update Booking
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status, assignedTo }) => {
      const res = await apiRequest("PUT", `/api/bookings/${id}`, { status, assignedTo });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Booking updated" });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => {
      toast({ title: "Update failed", variant: "destructive" });
    },
  });

  if (isLoading) return <p>Loading bookings...</p>;
  const bookings = bookingsData?.bookings || [];

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card key={booking._id} className="p-4 space-y-2">
          <h3 className="text-lg font-bold">{booking.fullName}</h3>
          <p className="text-sm text-muted-foreground">Service: {booking.service}</p>

          <select
            defaultValue={booking.status}
            onChange={(e) =>
              updateBookingMutation.mutate({
                id: booking._id,
                status: e.target.value,
                assignedTo: booking.assignedTo,
              })
            }
            className="w-full border p-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <Input
            placeholder="Assign to (e.g. Jane Doe)"
            defaultValue={booking.assignedTo}
            onBlur={(e) =>
              updateBookingMutation.mutate({
                id: booking._id,
                status: booking.status,
                assignedTo: e.target.value,
              })
            }
          />
        </Card>
      ))}
    </div>
  );
}
