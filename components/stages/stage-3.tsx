"use client";

import React, { useState, useEffect } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Package,
  Warehouse,
  User,
  Hash,
  Upload,
  X,
} from "lucide-react";

export default function Stage3() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [vendorCount, setVendorCount] = useState(0);

  const [formData, setFormData] = useState({
    vendor1Name: "",
    vendor1Rate: "",
    vendor1Terms: "",
    vendor1DeliveryDate: "",
    vendor1Attachment: null,
    vendor1WarrantyStatus: "",
    vendor1WarrantyFrom: "",
    vendor1WarrantyTo: "",
    vendor2Name: "",
    vendor2Rate: "",
    vendor2Terms: "",
    vendor2DeliveryDate: "",
    vendor2Attachment: null,
    vendor2WarrantyStatus: "",
    vendor2WarrantyFrom: "",
    vendor2WarrantyTo: "",
    vendor3Name: "",
    vendor3Rate: "",
    vendor3Terms: "",
    vendor3DeliveryDate: "",
    vendor3Attachment: null,
    vendor3WarrantyStatus: "",
    vendor3WarrantyFrom: "",
    vendor3WarrantyTo: "",
  });

  const isThirdParty = currentRecord?.data?.vendorType === "third party";
  const numVendors = isThirdParty ? 3 : 1;

  const pending = records.filter(
    (r) => r.stage === 3 && r.status === "pending"
  );
  const completed = records.filter((r) => r.history.some((h) => h.stage === 3));

  const columns = [
    { key: "indentNumber", label: "Indent #", icon: Hash },
    { key: "createdBy", label: "Created By", icon: User },
    { key: "category", label: "Category", icon: FileText },
    { key: "itemName", label: "Item", icon: Package },
    { key: "quantity", label: "Qty", icon: Package },
    { key: "warehouse", label: "Warehouse", icon: Warehouse },
    { key: "deliveryDate", label: "Exp. Delivery", icon: Calendar },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(col => col.key));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord && vendorCount >= numVendors) {
      updateRecord(selectedRecord, formData);

      // Route based on vendor count: single vendor skips negotiation, multiple vendors go to negotiation
      if (isThirdParty) {
        // Multiple vendors - go to negotiation (stage 4)
        moveToNextStage(selectedRecord);
      } else {
        // Single vendor - skip negotiation, go directly to PO creation (stage 5)
        moveToNextStage(selectedRecord);
        moveToNextStage(selectedRecord); // Move again to skip stage 4
      }

      resetForm();
    }
  };

  const resetForm = () => {
    setOpen(false);
    setSelectedRecord(null);
    setCurrentRecord(null);
    setVendorCount(0);
    setFormData({
      vendor1Name: "",
      vendor1Rate: "",
      vendor1Terms: "",
      vendor1DeliveryDate: "",
      vendor1Attachment: null,
      vendor1WarrantyStatus: "",
      vendor1WarrantyFrom: "",
      vendor1WarrantyTo: "",
      vendor2Name: "",
      vendor2Rate: "",
      vendor2Terms: "",
      vendor2DeliveryDate: "",
      vendor2Attachment: null,
      vendor2WarrantyStatus: "",
      vendor2WarrantyFrom: "",
      vendor2WarrantyTo: "",
      vendor3Name: "",
      vendor3Rate: "",
      vendor3Terms: "",
      vendor3DeliveryDate: "",
      vendor3Attachment: null,
      vendor3WarrantyStatus: "",
      vendor3WarrantyFrom: "",
      vendor3WarrantyTo: "",
    });
  };

  const handleOpenForm = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    if (record) {
      setSelectedRecord(recordId);
      setCurrentRecord(record);
      setOpen(true);
      setVendorCount(0);
    }
  };

  // Auto-update vendor count
  useEffect(() => {
    let filled = 0;
    for (let i = 1; i <= numVendors; i++) {
      if (formData[`vendor${i}Name` as keyof typeof formData]) filled++;
    }
    setVendorCount(filled);
  }, [formData, numVendors]);

  const handleFileRemove = (vendorNum: number) => {
    setFormData({ ...formData, [`vendor${vendorNum}Attachment`]: null });
  };

  return (
    <div className="p-6">
      {/* Header Card with Title and Column Filter */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 3: Vendor Quotation</h2>
            <p className="text-gray-600 mt-1">
              {isThirdParty ? "Collect 3 vendor quotes" : "Update single vendor details"}
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
              <p className="text-lg text-gray-500">No pending vendor updates</p>
              <p className="text-sm text-gray-400 mt-1">All quotes received!</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                      <TableHead key={col.key}>
                        <div className="flex items-center gap-2">
                          {col.icon && <col.icon className="w-4 h-4" />}
                          {col.label}
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record) => (
                    <TableRow key={record.id}>
                      {columns.filter(col => selectedColumns.includes(col.key)).map((col) => (
                        <TableCell key={col.key}>
                          {col.key === "deliveryDate"
                            ? new Date(record.data[col.key]).toLocaleDateString("en-IN")
                            : String(record.data[col.key] || "-")}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenForm(record.id)}
                        >
                          Update Vendor
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
            stage={3}
            pending={[]}
            history={completed}
            onOpenForm={() => {}}
            onSelectRecord={() => {}}
            columns={columns.filter(col => selectedColumns.includes(col.key))}
            showPending={false}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              Update {numVendors} Vendor{numVendors > 1 ? "s" : ""}
            </DialogTitle>
            <p className="text-sm text-gray-600">
              {isThirdParty
                ? "Enter details for 3 different vendors"
                : "Enter details for the selected vendor"}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Item Summary */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Item Details</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Indent #:</span>
                  <p>{currentRecord?.data?.indentNumber || "—"}</p>
                </div>
                <div>
                  <span className="font-medium">Item:</span>
                  <p>{currentRecord?.data?.itemName || "—"}</p>
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>
                  <p>{currentRecord?.data?.quantity || "—"}</p>
                </div>
              </div>
            </div>

            {/* Vendor Forms */}
            {Array.from({ length: numVendors }, (_, i) => i + 1).map((num) => (
              <div key={num} className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Vendor {num}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Vendor Name */}
                  <div className="space-y-2">
                    <Label htmlFor={`vendor${num}Name`}>
                      Vendor Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`vendor${num}Name`}
                      value={formData[`vendor${num}Name` as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`vendor${num}Name`]: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter vendor name"
                    />
                  </div>

                  {/* Rate per Qty */}
                  <div className="space-y-2">
                    <Label htmlFor={`vendor${num}Rate`}>
                      Rate per Qty <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`vendor${num}Rate`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData[`vendor${num}Rate` as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`vendor${num}Rate`]: e.target.value,
                        })
                      }
                      required
                      placeholder="0.00"
                    />
                  </div>

                  {/* Payment Terms */}
                  <div className="space-y-2">
                    <Label htmlFor={`vendor${num}Terms`}>
                      Payment Terms <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData[`vendor${num}Terms` as keyof typeof formData]}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          [`vendor${num}Terms`]: val,
                        })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="advance">Advance</SelectItem>
                        <SelectItem value="PI">PI (Proforma Invoice)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Expected Delivery Date */}
                  <div className="space-y-2">
                    <Label htmlFor={`vendor${num}DeliveryDate`}>
                      Expected Delivery Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`vendor${num}DeliveryDate`}
                      type="date"
                      value={formData[`vendor${num}DeliveryDate` as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`vendor${num}DeliveryDate`]: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  {/* Warranty / Guarantee Status */}
                  <div className="space-y-2">
                    <Label htmlFor={`vendor${num}WarrantyStatus`}>
                      Warranty / Guarantee Status
                    </Label>
                    <Select
                      value={formData[`vendor${num}WarrantyStatus` as keyof typeof formData]}
                      onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          [`vendor${num}WarrantyStatus`]: val,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Warranty Dates */}
                  {formData[`vendor${num}WarrantyStatus` as keyof typeof formData] === "yes" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor={`vendor${num}WarrantyFrom`}>
                          Warranty From
                        </Label>
                        <Input
                          id={`vendor${num}WarrantyFrom`}
                          type="date"
                          value={formData[`vendor${num}WarrantyFrom` as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [`vendor${num}WarrantyFrom`]: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`vendor${num}WarrantyTo`}>
                          Warranty To
                        </Label>
                        <Input
                          id={`vendor${num}WarrantyTo`}
                          type="date"
                          value={formData[`vendor${num}WarrantyTo` as keyof typeof formData]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [`vendor${num}WarrantyTo`]: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Attachment */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor={`vendor${num}Attachment`}>Attachment</Label>
                  <div>
                    <input
                      id={`vendor${num}Attachment`}
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [`vendor${num}Attachment`]: e.target.files?.[0] || null,
                        })
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor={`vendor${num}Attachment`}
                      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                    >
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Upload file</span>
                    </label>
                    {formData[`vendor${num}Attachment` as keyof typeof formData] && (
                      <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">
                            {(formData[`vendor${num}Attachment` as keyof typeof formData] as File)?.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFileRemove(num)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-3">
              <span>Vendors Filled:</span>
              <div className="flex gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i < vendorCount ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span>{vendorCount} / {numVendors}</span>
            </div>

            {/* Submit Button - Inside Form */}
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={vendorCount < numVendors}>
                Submit {numVendors} Vendor{numVendors > 1 ? "s" : ""}
              </Button>
            </div>
          </form>

          {/* Actions - Fixed at bottom */}
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}