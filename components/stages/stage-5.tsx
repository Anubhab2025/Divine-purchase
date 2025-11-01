"use client";

import type React from "react";
import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, X } from "lucide-react";

export default function Stage5() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [formData, setFormData] = useState({
    poNumber: "",
    basicValue: "",
    totalWithTax: "",
    paymentTerms: "",
    remarks: "",
    poCopy: null as File | null,
  });

  const pending = records.filter(
    (r) => r.stage === 5 && r.status === "pending"
  );
  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 5)
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
    { key: "basicValue", label: "Basic Value" },
    { key: "totalWithTax", label: "Total with Tax" },
    { key: "paymentTerms", label: "Payment Terms" },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

  const handleOpenForm = (recordId: string) => {
    setSelectedRecord(recordId);
    setFormData({
      poNumber: `PO-${Date.now().toString().slice(-6)}`,
      basicValue: "",
      totalWithTax: "",
      paymentTerms: "",
      remarks: "",
      poCopy: null,
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord) {
      updateRecord(selectedRecord, formData);
      moveToNextStage(selectedRecord);
      setOpen(false);
      setSelectedRecord(null);
      setFormData({
        poNumber: "",
        basicValue: "",
        totalWithTax: "",
        paymentTerms: "",
        remarks: "",
        poCopy: null,
      });
    }
  };

  const handleFileRemove = () => {
    setFormData({ ...formData, poCopy: null });
  };

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filter */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 5: PO Creation</h2>
            <p className="text-gray-600 mt-1">Generate and attach purchase orders</p>
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
              <p className="text-lg text-gray-500">No pending PO entries</p>
              <p className="text-sm text-gray-400 mt-1">All purchase orders are created!</p>
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
                          Create PO
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
            stage={5}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter(col => selectedColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      {/* PO Creation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <p className="text-sm text-gray-600">
              Enter PO details and attach the official document.
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* PO Number */}
                <div className="space-y-2">
                  <Label htmlFor="poNumber">PO Number</Label>
                  <Input
                    id="poNumber"
                    value={formData.poNumber}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                {/* Basic Value */}
                <div className="space-y-2">
                  <Label htmlFor="basicValue">
                    Basic Value <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="basicValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.basicValue}
                    onChange={(e) =>
                      setFormData({ ...formData, basicValue: e.target.value })
                    }
                    required
                    placeholder="0.00"
                  />
                </div>

                {/* Total With Tax */}
                <div className="space-y-2">
                  <Label htmlFor="totalWithTax">
                    Total With Tax <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="totalWithTax"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalWithTax}
                    onChange={(e) =>
                      setFormData({ ...formData, totalWithTax: e.target.value })
                    }
                    required
                    placeholder="0.00"
                  />
                </div>

                {/* Payment Terms */}
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">
                    Payment Terms <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="paymentTerms"
                    value={formData.paymentTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentTerms: e.target.value })
                    }
                    required
                    placeholder="e.g. 50% Advance, 50% on Delivery"
                  />
                </div>
              </div>

              {/* PO Copy Attachment */}
              <div className="space-y-2">
                <Label htmlFor="poCopy">PO Copy (Attachment)</Label>
                <div>
                  <input
                    id="poCopy"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        poCopy: e.target.files?.[0] || null,
                      })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor="poCopy"
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <Upload className="w-6 h-6 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Upload PO copy</span>
                  </label>
                  {formData.poCopy && (
                    <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">
                          {formData.poCopy.name}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          ({(formData.poCopy.size / 1024).toFixed(1)} KB)
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

              {/* Remarks */}
              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  placeholder="Any special instructions..."
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !formData.basicValue ||
                    !formData.totalWithTax ||
                    !formData.paymentTerms
                  }
                >
                  Create PO
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}