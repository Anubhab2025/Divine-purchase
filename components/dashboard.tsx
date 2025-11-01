"use client"

import { useWorkflow } from "@/lib/workflow-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Layers,
  TrendingUp,
  Activity,
  PieChart,
  Calendar,
  Users
} from "lucide-react"

export default function Dashboard() {
  const { records } = useWorkflow()

  const stageCounts = Array.from({ length: 14 }, (_, i) => {
    const stageNum = i + 1
    return {
      stage: stageNum,
      pending: records.filter((r) => r.stage === stageNum && r.status === "pending").length,
      completed: records.filter((r) => r.history.some((h) => h.stage === stageNum)).length,
      total: records.filter((r) => r.stage === stageNum || r.history.some((h) => h.stage === stageNum)).length,
    }
  })

  const totalRecords = records.length
  const completedRecords = records.filter((r) => r.status === "completed").length
  const pendingRecords = totalRecords - completedRecords

  // Calculate stage distribution
  const stageDistribution = stageCounts.map(({ stage, total }) => ({
    stage,
    count: total,
    percentage: totalRecords > 0 ? Math.round((total / totalRecords) * 100) : 0
  })).filter(item => item.count > 0)

  // Recent activity (last 7 days)
  const recentRecords = records.filter(record => {
    const recordDate = new Date(record.createdAt || Date.now())
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return recordDate >= weekAgo
  }).length

  // Performance metrics
  const avgCompletionTime = totalRecords > 0 ? Math.round(totalRecords / 7) : 0 // Mock calculation

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time overview of all purchase workflow stages
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="progress" className="text-xs sm:text-sm">Progress</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          <TabsTrigger value="records" className="text-xs sm:text-sm">Records</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Records
                </CardTitle>
                <Layers className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalRecords}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active workflows
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending
                </CardTitle>
                <Clock3 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingRecords}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Awaiting action
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completedRecords}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Successfully processed
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </CardTitle>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {totalRecords > 0
                    ? Math.round((completedRecords / totalRecords) * 100)
                    : 0}
                  %
                </div>
                <Progress
                  value={totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0}
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentRecords}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Records updated in last 7 days
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Avg. Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgCompletionTime}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Records per day
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Active Stages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stageCounts.filter(s => s.pending + s.completed > 0).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Stages with records
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Health & Stage Overview */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Workflow Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall Efficiency</span>
                    <span className="text-sm font-medium">
                      {totalRecords > 0 && completedRecords / totalRecords > 0.7 ? "Excellent" :
                       totalRecords > 0 && completedRecords / totalRecords > 0.5 ? "Good" : "Needs Attention"}
                    </span>
                  </div>
                  <Progress
                    value={totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-muted-foreground">
                      {stageCounts.filter(s => s.pending > 0).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Stages with pending</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-muted-foreground">
                      {stageCounts.filter(s => s.completed > 0).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Stages completed</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Quick Actions</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm">
                        View Pending
                      </Button>
                      <Button variant="outline" size="sm">
                        Export Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Stage Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stageCounts.slice(0, 7).map(({ stage, pending, completed, total }) => (
                  <div key={stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Stage {stage}</span>
                      <span className="text-muted-foreground text-xs">
                        {total} records
                      </span>
                    </div>
                    <Progress
                      value={total > 0 ? (completed / total) * 100 : 0}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pending: {pending}</span>
                      <span>Done: {completed}</span>
                    </div>
                  </div>
                ))}
                {stageCounts.length > 7 && (
                  <div className="text-center text-xs text-muted-foreground pt-2">
                    +{stageCounts.length - 7} more stages
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Records Preview */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Records
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest workflow updates
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {records.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        record.status === "completed" ? "bg-muted-foreground" : "bg-orange-400"
                      }`} />
                      <div>
                        <p className="font-mono text-sm font-medium">{record.id}</p>
                        <p className="text-xs text-muted-foreground">
                          Stage {record.stage} • {record.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {records.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No records yet</p>
                  </div>
                )}
                {records.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm">
                      View All Records
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6 mt-6">
          {/* Stage Progress Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Stage-wise Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stageCounts.map(({ stage, pending, completed, total }) => (
                  <div key={stage} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Stage {stage}</span>
                      <span className="text-muted-foreground">
                        {total} total
                      </span>
                    </div>
                    <Progress
                      value={total > 0 ? (completed / total) * 100 : 0}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Pending: {pending}</span>
                      <span>Completed: {completed}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stageDistribution.slice(0, 8).map(({ stage, count, percentage }) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                      <span className="text-sm font-medium">Stage {stage}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">{count}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                ))}
                {stageDistribution.length > 8 && (
                  <div className="text-center text-sm text-muted-foreground pt-2 border-t">
                    +{stageDistribution.length - 8} more stages
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stage Table */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Detailed Stage Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Stage</th>
                      <th className="text-center py-2 font-medium">Pending</th>
                      <th className="text-center py-2 font-medium">Completed</th>
                      <th className="text-center py-2 font-medium">Total</th>
                      <th className="text-center py-2 font-medium">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stageCounts.map(({ stage, pending, completed, total }) => (
                      <tr key={stage} className="border-b hover:bg-muted/50">
                        <td className="py-3 font-medium">Stage {stage}</td>
                        <td className="py-3 text-center">{pending}</td>
                        <td className="py-3 text-center">{completed}</td>
                        <td className="py-3 text-center font-medium">{total}</td>
                        <td className="py-3 text-center">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={total > 0 ? (completed / total) * 100 : 0}
                              className="w-16 h-2"
                            />
                            <span className="text-xs text-muted-foreground w-8">
                              {total > 0 ? Math.round((completed / total) * 100) : 0}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Workflow Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completion Rate</span>
                    <span className="text-sm font-medium">
                      {totalRecords > 0
                        ? Math.round((completedRecords / totalRecords) * 100)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0}
                    className="h-2"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Records</span>
                    <span className="text-sm font-medium">{pendingRecords}</span>
                  </div>
                  <Progress
                    value={totalRecords > 0 ? (pendingRecords / totalRecords) * 100 : 0}
                    className="h-2"
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span>Overall Health</span>
                    <span className="font-medium">
                      {totalRecords > 0 && completedRecords / totalRecords > 0.7 ? "Excellent" :
                       totalRecords > 0 && completedRecords / totalRecords > 0.5 ? "Good" : "Needs Attention"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Stage Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold mb-2">
                    {stageCounts.filter(s => s.total > 0).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Active Stages</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Most Active Stage</span>
                    <span className="font-medium">
                      {stageCounts.reduce((max, curr) =>
                        curr.total > max.total ? curr : max, stageCounts[0]).stage}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Records in Stage</span>
                    <span className="font-medium">
                      {stageCounts.reduce((max, curr) =>
                        curr.total > max.total ? curr : max, stageCounts[0]).total}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-3xl font-bold mb-2">{recentRecords}</div>
                  <p className="text-sm text-muted-foreground">Recent Updates</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span className="font-medium">{recentRecords}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>All Time</span>
                    <span className="font-medium">{totalRecords}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Growth Rate</span>
                    <span className="font-medium">
                      {totalRecords > 0 ? Math.round((recentRecords / totalRecords) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records" className="space-y-6 mt-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5" />
                All Records
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete list of all workflow records
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-h-[32rem] overflow-y-auto rounded-md border border-border divide-y divide-border">
                {records.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No records yet</p>
                    <p className="text-sm">Start by creating your first indent</p>
                  </div>
                ) : (
                  records.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-mono text-sm font-bold">
                          {record.id}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Stage {record.stage}</span>
                          <span>•</span>
                          <span className={`font-medium ${
                            record.status === "completed"
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}>
                            {record.status === "completed" ? "Completed" : "Pending"}
                          </span>
                        </div>
                        {record.data?.itemName && (
                          <p className="text-sm text-muted-foreground">
                            {record.data.itemName}
                          </p>
                        )}
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(record.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
