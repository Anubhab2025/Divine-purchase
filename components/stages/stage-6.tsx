"use client";

import type React from "react";
import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Upload, X } from "lucide-react";

export default function Stage6() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    status: "",
    followUpDate: "",
    remarks: "",
    transporterName: "",
    vehicleNumber: "",
    contactNumber: "",
    lrNumber: "",
    biltyCopy: null as File | null,
    dispatchDate: "",
    freightAmount: "",
    advanceAmount: "",
    liftNumber: "",
  });

  const pending = records.filter(
    (r) => r.stage === 6 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 6)
  );

  const columns = [
    { key: "indentNumber", label: "Indent #" },
    { key: "createdBy", label: "Created By" },
    { key: "category", label: "Category" },
    { key: "itemName", label: "Item" },
    { key: "quantity", label: "Qty" },
    { key: "warehouse", label: "Warehouse" },
    { key: "deliveryDate", label: "Exp. Delivery" },
    { key: "poNumber", label: "PO Number" },
    { key: "liftNumber", label: "Lift Number" },
    { key: "status", label: "Status" },
    { key: "transporterName", label: "Transporter" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

  const handleOpenForm = (recordId: string) => {
    setSelectedRecord(recordId);
    setFormData({
      status: "",
      followUpDate: "",
      remarks: "",
      transporterName: "",
      vehicleNumber: "",
      contactNumber: "",
      lrNumber: "",
      biltyCopy: null,
      dispatchDate: "",
      freightAmount: "",
      advanceAmount: "",
      liftNumber: "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord) {
      const finalFormData = { ...formData };
      if (formData.status === "lift-material") {
        finalFormData.liftNumber = `LIFT-${Date.now().toString().slice(-6)}`;
      }
      updateRecord(selectedRecord, finalFormData);

      // Only move to next stage if lifting material, follow-up stays in pending
      if (formData.status === "lift-material") {
        moveToNextStage(selectedRecord);
      }

      setOpen(false);
      setSelectedRecord(null);
      setFormData({
        status: "",
        followUpDate: "",
        remarks: "",
        transporterName: "",
        vehicleNumber: "",
        contactNumber: "",
        lrNumber: "",
        biltyCopy: null,
        dispatchDate: "",
        freightAmount: "",
        advanceAmount: "",
        liftNumber: "",
      });
    }
  };

  const handleFileRemove = () => {
    setFormData({ ...formData, biltyCopy: null });
  };

  const isFollowUpValid =
    formData.status === "follow-up" &&
    formData.followUpDate &&
    formData.remarks;

  const isLiftValid =
    formData.status === "lift-material" &&
    formData.transporterName &&
    formData.vehicleNumber &&
    formData.contactNumber &&
    formData.lrNumber &&
    formData.biltyCopy &&
    formData.dispatchDate &&
    formData.freightAmount;

  const isFormValid = isFollowUpValid || isLiftValid;

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filter */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 6: Vendor Follow-Up</h2>
            <p className="text-gray-600 mt-1">
              Track dispatch and material lift status
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Select
              value=""
              onValueChange={() => {}}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder={`${selectedColumns.length} columns selected`} />
              </SelectTrigger>
              <SelectContent className="w-64">
                <div className="p-2">
                  <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedColumns.length === columns.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedColumns(columns.map(col => col.key));
                        } else {
                          setSelectedColumns([]);
                        }
                      }}
                    />
                    <Label className="text-sm font-medium">All Columns</Label>
                  </div>
                  {columns.map((col) => (
                    <div key={col.key} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={selectedColumns.includes(col.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColumns([...selectedColumns, col.key]);
                          } else {
                            setSelectedColumns(selectedColumns.filter(c => c !== col.key));
                          }
                        }}
                      />
                      <Label className="text-sm">{col.label}</Label>
                    </div>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({completed.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No pending follow-ups</p>
              <p className="text-sm text-gray-400 mt-1">All vendors are updated!</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                      <TableHead key={col.key}>
                        {col.label}
                      </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">
                        {record.id}
                      </TableCell>
                      {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                        <TableCell key={col.key}>
                          {col.key === "deliveryDate"
                            ? new Date(record.data[col.key]).toLocaleDateString("en-IN")
                            : String(record.data[col.key] || "-")}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(record.id)}
                        >
                          Follow-Up
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <StageTable
            title=""
            stage={6}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter(col => selectedColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* Follow-Up Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Vendor Follow-Up & Dispatch</DialogTitle>
            <p className="text-sm text-gray-600">
              Update status: Schedule follow-up or confirm material dispatch.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Status Selection */}
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => {
                    setFormData({
                      ...formData,
                      status: val,
                      followUpDate: val === "follow-up" ? formData.followUpDate : "",
                      remarks: val === "follow-up" ? formData.remarks : "",
                      transporterName: val === "lift-material" ? formData.transporterName : "",
                      vehicleNumber: val === "lift-material" ? formData.vehicleNumber : "",
                      contactNumber: val === "lift-material" ? formData.contactNumber : "",
                      lrNumber: val === "lift-material" ? formData.lrNumber : "",
                      biltyCopy: val === "lift-material" ? formData.biltyCopy : null,
                      dispatchDate: val === "lift-material" ? formData.dispatchDate : "",
                      freightAmount: val === "lift-material" ? formData.freightAmount : "",
                      advanceAmount: val === "lift-material" ? formData.advanceAmount : "",
                      liftNumber: "",
                    });
                  }}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow-up">Follow-Up</SelectItem>
                    <SelectItem value="lift-material">Lift The Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional: Follow-Up */}
              {formData.status === "follow-up" && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Follow-Up Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="followUpDate">
                        Next Follow-up Date <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="followUpDate"
                        type="date"
                        value={formData.followUpDate}
                        onChange={(e) =>
                          setFormData({ ...formData, followUpDate: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="remarks">
                        Remarks <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        id="remarks"
                        value={formData.remarks}
                        onChange={(e) =>
                          setFormData({ ...formData, remarks: e.target.value })
                        }
                        required
                        placeholder="Follow-up details..."
                        className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Conditional: Lift Material */}
              {formData.status === "lift-material" && (
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium">Lifting Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transporterName">
                        Transporter Name <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="transporterName"
                        value={formData.transporterName}
                        onChange={(e) =>
                          setFormData({ ...formData, transporterName: e.target.value })
                        }
                        required
                        placeholder="Transporter name"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vehicleNumber">
                        Vehicle Number <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, vehicleNumber: e.target.value })
                        }
                        required
                        placeholder="Vehicle number"
                        className="w-full px-3 py-2 border border-gray-300 rounded uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">
                        Transport Contact Number <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="contactNumber"
                        value={formData.contactNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, contactNumber: e.target.value })
                        }
                        required
                        placeholder="Contact number"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lrNumber">
                        LR Number <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="lrNumber"
                        value={formData.lrNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, lrNumber: e.target.value })
                        }
                        required
                        placeholder="LR/Bilty number"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dispatchDate">
                        Dispatch Date <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="dispatchDate"
                        type="date"
                        value={formData.dispatchDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dispatchDate: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="freightAmount">
                        Total Freight Amt. <span className="text-red-500">*</span>
                      </Label>
                      <input
                        id="freightAmount"
                        type="number"
                        value={formData.freightAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, freightAmount: e.target.value })
                        }
                        required
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="advanceAmount">Advance Amount IF Any</Label>
                      <input
                        id="advanceAmount"
                        type="number"
                        value={formData.advanceAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, advanceAmount: e.target.value })
                        }
                        placeholder="0.00 (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>

                    {/* Lift Number Display */}
                    {formData.status === "lift-material" && (
                      <div className="space-y-2 col-span-2">
                        <Label>Lift Number (Auto-generated)</Label>
                        <div className="p-3 bg-gray-50 border rounded font-mono text-lg">
                          LIFT-{Date.now().toString().slice(-6)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BILTY COPY UPLOAD */}
                  <div className="space-y-2">
                    <Label htmlFor="biltyCopy">BILTY COPY UPLOAD <span className="text-red-500">*</span></Label>
                    <div>
                      <input
                        id="biltyCopy"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            biltyCopy: e.target.files?.[0] || null,
                          })
                        }
                        required
                        className="hidden"
                      />
                      <label
                        htmlFor="biltyCopy"
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                      >
                        <Upload className="w-6 h-6 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">Upload Bilty/LR Copy</span>
                      </label>
                      {formData.biltyCopy && (
                        <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">
                              {formData.biltyCopy.name}
                            </span>
                            <span className="text-xs text-gray-600 ml-2">
                              ({(formData.biltyCopy.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleFileRemove}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Actions - Fixed at bottom */}
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid} onClick={handleSubmit}>
              {formData.status === "follow-up" ? "Schedule Follow-Up" : "Confirm Dispatch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}