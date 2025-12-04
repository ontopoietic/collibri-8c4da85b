import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageSquare, ThumbsUp, Reply } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { mockConcerns } from "@/data/mockData";

type NotificationType = "reply" | "vote" | "counter-proposal";

interface Notification {
  id: string;
  type: NotificationType;
  concernId: string;
  concernTitle: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Mock notifications - in a real app, these would come from user activity tracking
const generateMockNotifications = (): Notification[] => {
  const notifications: Notification[] = [];
  
  // Generate notifications from concerns with activity
  mockConcerns.slice(0, 8).forEach((concern, index) => {
    if (concern.replies.length > 0) {
      notifications.push({
        id: `notif-${index}-1`,
        type: "reply",
        concernId: concern.id,
        concernTitle: concern.title,
        message: `New reply on your ${concern.type}: "${concern.replies[0].text.substring(0, 50)}..."`,
        timestamp: new Date(Date.now() - index * 3600000),
        read: index > 3,
      });
    }
    
    if (concern.votes > 20) {
      notifications.push({
        id: `notif-${index}-2`,
        type: "vote",
        concernId: concern.id,
        concernTitle: concern.title,
        message: `Your ${concern.type} reached ${concern.votes} votes!`,
        timestamp: new Date(Date.now() - (index + 1) * 7200000),
        read: index > 5,
      });
    }
  });
  
  return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(generateMockNotifications());
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : !n.read
  );

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "reply":
        return <MessageSquare className="h-4 w-4" />;
      case "vote":
        return <ThumbsUp className="h-4 w-4" />;
      case "counter-proposal":
        return <Reply className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "reply":
        return "bg-blue-500/10 text-blue-500";
      case "vote":
        return "bg-green-500/10 text-green-500";
      case "counter-proposal":
        return "bg-purple-500/10 text-purple-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Feed</span>
        </Button>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </Button>
          </div>

          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-card p-4 rounded-lg border transition-colors cursor-pointer hover:border-primary/50 ${
                  notification.read ? "border-border" : "border-primary/30 bg-primary/5"
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  navigate(`/concern/${notification.concernId}`);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-foreground line-clamp-1">
                        {notification.concernTitle}
                      </h3>
                      {!notification.read && (
                        <Badge variant="default" className="shrink-0 h-5">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
