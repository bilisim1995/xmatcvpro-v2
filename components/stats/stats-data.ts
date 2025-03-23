import { Users, Globe2, TrendingUp } from 'lucide-react';

export const statsData = {
  metrics: [
    {
      title: "Total Models",
      value: "10K+",
      icon: Users,
      description: "Total number of models in database"
    },
    {
      title: "Monthly Visitors",
      value: "250K+",
      icon: Globe2,
      description: "Unique visitors in last 30 days"
    },
    {
      title: "Daily Searches",
      value: "50K+",
      icon: TrendingUp,
      description: "Average daily search count"
    }
  ],
  demographics: {
    gender: [
      { type: "Male", percentage: 65 },
      { type: "Female", percentage: 32 },
      { type: "Other", percentage: 3 }
    ],
    age: [
      { group: "18-24", percentage: 35 },
      { group: "25-34", percentage: 45 },
      { group: "35-44", percentage: 15 },
      { group: "45+", percentage: 5 }
    ],
    countries: [
      { name: "USA", percentage: 30, users: "750K" },
      { name: "Germany", percentage: 15, users: "375K" },
      { name: "UK", percentage: 12, users: "300K" },
      { name: "France", percentage: 10, users: "250K" },
      { name: "Others", percentage: 33, users: "825K" }
    ],
    activity: [
      { time: "Peak Hours", value: "21:00 - 23:00 UTC" },
      { time: "Most Active Day", value: "Saturday" },
      { time: "Avg. Session", value: "12 minutes" }
    ]
  }
};