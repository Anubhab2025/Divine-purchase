"use client";

import React, { useState, useEffect } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { FileText, Upload, X, Shield, ShieldCheck, CheckCircle2, Plus, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LiftingEntry {
  liftNumber: string;
  liftingQty: string;
  transporterName: string;
  vehicleNumber: string;
  contactNumber: string;
  lrNumber: string;
  biltyCopy: File | null;
  dispatchDate: string;
  freightAmount: string;
  advanceAmount: string;
  paymentDate: string;
}

interface RecordLifting {
  recordId: string;
  status: string;
  followUpDate?: string;
  remarks?: string;
  quantity?: number | string;
  liftingData: LiftingEntry[];
}

export default function Stage6() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const [bulkFormData, setBulkFormData] = useState<RecordLifting[]>([]);
  const [liftCounter, setLiftCounter] = useState(1);

  const pending = records.filter((r) => r.stage === 6 && r.status === "pending");
  const completed = records.filter((r) => r.history.some((h) => h.stage === 6));

  const baseColumns = [
    { key: "indentNumber", label: "Indent #", icon: null },
    { key: "itemName", label: "Item", icon: null },
    { key: "quantity", label: "Qty", icon: null },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    baseColumns.map((c) => c.key)
  );

  const paymentTermsList = [
    { value: "15", label: "15 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "advance", label: "Advance" },
    { value: "PI", label: "PI (Proforma Invoice)" },
  ];

  const transporters = [
    "ABC Logistics", "XYZ Transports", "Fastway Couriers", "SafeHaul Pvt Ltd",
    "Metro Movers", "Speedy Freight", "National Carriers", "BlueDart Logistics",
    "DTDC Express", "VRL Logistics",
  ];

  useEffect(() => {
    const liftedCount = records.reduce((acc, r) => {
      const lifts = r.data?.liftingData || [];
      return acc + lifts.length;
    }, 0);
    setLiftCounter(liftedCount + 1);
  }, [records]);

  const getVendorData = (record: any) => {
    const selectedId = record.data.selectedVendor || "vendor1";
    const idx = parseInt(selectedId.replace("vendor", ""), 10) || 1;
    return {
      name: record.data[`vendor${idx}Name`] || "-",
      rate: record.data[`vendor${idx}Rate`],
      terms: record.data[`vendor${idx}Terms`],
      delivery: record.data[`vendor${idx}DeliveryDate`],
      warrantyType: record.data[`vendor${idx}WarrantyType`],
      attachment: record.data[`vendor${idx}Attachment`],
      approvedBy: record.data.approvedBy || "Auto-Approved",
      poNumber: record.data.poNumber || "-",
      basicValue: record.data.basicValue || "-",
      totalWithTax: record.data.totalWithTax || "-",
      poCopy: record.data.poCopy,
    };
  };

  const handleBulkOpen = () => {
    if (selectedRecords.length === 0) return;
    const initialData = selectedRecords.map((id) => {
      const record = records.find((r) => r.id === id)!;
      return {
        recordId: id,
        status: "",
        followUpDate: "",
        remarks: "",
        liftingData: [],
        indentNumber: record.data.indentNumber,
        quantity: record.data.quantity,
      };
    });
    setBulkFormData(initialData);
    setOpen(true);
  };

  const addLiftingEntry = (recordIndex: number) => {
    const newEntry: LiftingEntry = {
      liftNumber: `LIFT-${String(liftCounter).padStart(3, "0")}`,
      liftingQty: String(bulkFormData[recordIndex].quantity || 0),
      transporterName: "",
      vehicleNumber: "",
      contactNumber: "",
      lrNumber: "",
      biltyCopy: null,
      dispatchDate: "",
      freightAmount: "",
      advanceAmount: "",
      paymentDate: "",
    };
    setBulkFormData((prev) => {
      const updated = [...prev];
      updated[recordIndex].liftingData.push(newEntry);
      return updated;
    });
    setLiftCounter((prev) => prev + 1);
  };

  const removeLiftingEntry = (recordIndex: number, liftIndex: number) => {
    setBulkFormData((prev) => {
      const updated = [...prev];
      updated[recordIndex].liftingData.splice(liftIndex, 1);
      return updated;
    });
  };

  const updateLiftingEntry = (recordIndex: number, liftIndex: number, field: keyof LiftingEntry, value: any) => {
    setBulkFormData((prev) => {
      const updated = [...prev];
      updated[recordIndex].liftingData[liftIndex] = {
        ...updated[recordIndex].liftingData[liftIndex],
        [field]: value,
      };
      return updated;
    });
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // First, update all records with their data
    bulkFormData.forEach((item) => {
      const finalData = {
        status: item.status,
        followUpDate: item.followUpDate,
        remarks: item.remarks,
        liftingData: item.liftingData,
      };
      updateRecord(item.recordId, finalData);
    });
    
    // Then, move records to next stage (this will save the updated data to history)
    setTimeout(() => {
      bulkFormData.forEach((item) => {
        if (item.status === "lift-material" && item.liftingData.length > 0) {
          moveToNextStage(item.recordId);
        }
      });
      resetBulk();
    }, 100);
  };

  const resetBulk = () => {
    setOpen(false);
    setSelectedRecords([]);
    setBulkFormData([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedRecords((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedRecords.length === pending.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(pending.map((r) => r.id));
    }
  };

  const isBulkValid =
    bulkFormData.length > 0 &&
    bulkFormData.every((item) => {
      if (item.status === "follow-up") {
        return item.followUpDate && item.remarks;
      }
      return (
        item.liftingData.length > 0 &&
        item.liftingData.every(
          (e) =>
            e.transporterName &&
            e.vehicleNumber &&
            e.contactNumber &&
            e.lrNumber &&
            e.biltyCopy &&
            e.dispatchDate &&
            e.freightAmount &&
            e.liftingQty
        )
      );
    });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 6: Vendor Follow-Up</h2>
            <p className="text-gray-600 mt-1">Track dispatch and material lift status</p>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-64 justify-start">
                  {selectedColumns.length} selected
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 pb-2 border-b">
                    <Checkbox
                      checked={selectedColumns.length === baseColumns.length}
                      onCheckedChange={(c) => {
                        if (c) setSelectedColumns(baseColumns.map((col) => col.key));
                        else setSelectedColumns([]);
                      }}
                    />
                    <Label className="text-sm font-medium">All Columns</Label>
                  </div>
                  {baseColumns.map((col) => (
                    <div key={col.key} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        checked={selectedColumns.includes(col.key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedColumns((prev) => [...prev, col.key]);
                          } else {
                            setSelectedColumns((prev) => prev.filter((c) => c !== col.key));
                          }
                        }}
                      />
                      <Label className="text-sm">{col.label}</Label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="history">History ({completed.length})</TabsTrigger>
        </TabsList>

        {/* PENDING */}
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No pending follow-ups</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedRecords.length === pending.length && pending.length > 0}
                        onCheckedChange={selectAll}
                      />
                    </TableHead>
                    {baseColumns
                      .filter((c) => selectedColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    <TableHead>Vendor</TableHead>
                    <TableHead>Rate/Qty</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Exp. Delivery</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Attachment</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Basic Value</TableHead>
                    <TableHead>Total w/Tax</TableHead>
                    <TableHead>PO Copy</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record) => {
                    const v = getVendorData(record);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRecords.includes(record.id)}
                            onCheckedChange={() => toggleSelect(record.id)}
                          />
                        </TableCell>
                        {baseColumns
                          .filter((c) => selectedColumns.includes(c.key))
                          .map((col) => (
                            <TableCell key={col.key}>{record.data[col.key] || "-"}</TableCell>
                          ))}
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>₹{v.rate || "-"}</TableCell>
                        <TableCell>
                          {paymentTermsList.find((t) => t.value === v.terms)?.label || v.terms || "-"}
                        </TableCell>
                        <TableCell>
                          {v.delivery ? new Date(v.delivery).toLocaleDateString("en-IN") : "-"}
                        </TableCell>
                        <TableCell>
                          {v.warrantyType ? (
                            <div className="flex items-center gap-1 text-xs">
                              {v.warrantyType === "warranty" ? (
                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                              )}
                              <span className="capitalize">{v.warrantyType}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {v.attachment ? (
                            <div className="flex items-center gap-1 text-blue-600 text-xs">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-20">{v.attachment.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{v.approvedBy}</TableCell>
                        <TableCell className="font-mono">{v.poNumber}</TableCell>
                        <TableCell>₹{v.basicValue}</TableCell>
                        <TableCell>₹{v.totalWithTax}</TableCell>
                        <TableCell>
                          {v.poCopy ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-20">{v.poCopy.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRecords([record.id]);
                              handleBulkOpen();
                            }}
                          >
                            Follow-Up
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {selectedRecords.length > 0 && (
                <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {selectedRecords.length} item{selectedRecords.length > 1 ? "s" : ""} selected
                  </p>
                  <Button onClick={handleBulkOpen} size="sm">
                    Follow-Up Selected
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No completed follow-ups</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-100 sticky top-0">
                  <TableRow className="border-b-2">
                    {baseColumns
                      .filter((c) => selectedColumns.includes(c.key))
                      .map((col) => (
                        <TableHead key={col.key}>{col.label}</TableHead>
                      ))}
                    <TableHead>Vendor</TableHead>
                    <TableHead>Rate/Qty</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Exp. Delivery</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Attachment</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Basic Value</TableHead>
                    <TableHead>Total w/Tax</TableHead>
                    <TableHead>PO Copy</TableHead>
                    <TableHead>Lift #</TableHead>
                    <TableHead>Lifting Qty</TableHead>
                    <TableHead>Transporter</TableHead>
                    <TableHead>Vehicle No</TableHead>
                    <TableHead>Contact No</TableHead>
                    <TableHead>LR No</TableHead>
                    <TableHead>Dispatch Date</TableHead>
                    <TableHead>Freight Amt</TableHead>
                    <TableHead>Advance Amt</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Bilty Copy</TableHead>
            
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((record) => {
                    // Get data from stage 6 history entry
                    const stage6History = record.history.find((h) => h.stage === 6);
                    const historyData = stage6History ? stage6History.data : record.data;
                    const v = getVendorData({ ...record, data: historyData });
                    const lifts = historyData.liftingData || [];
                    return lifts.length > 0 ? (
                      lifts.map((lift: LiftingEntry, idx: number) => (
                        <TableRow key={`${record.id}-${idx}`} className="bg-green-50">
                          {idx === 0 &&
                            baseColumns
                              .filter((c) => selectedColumns.includes(c.key))
                              .map((col) => (
                                <TableCell key={col.key} rowSpan={lifts.length}>
                                  {historyData[col.key] || "-"}
                                </TableCell>
                              ))}
                          {idx === 0 && (
                            <>
                              <TableCell rowSpan={lifts.length} className="font-medium">
                                <CheckCircle2 className="w-4 h-4 text-green-600 inline mr-1" />
                                {v.name}
                              </TableCell>
                              <TableCell rowSpan={lifts.length}>₹{v.rate || "-"}</TableCell>
                              <TableCell rowSpan={lifts.length}>
                                {paymentTermsList.find((t) => t.value === v.terms)?.label || v.terms || "-"}
                              </TableCell>
                              <TableCell rowSpan={lifts.length}>
                                {v.delivery ? new Date(v.delivery).toLocaleDateString("en-IN") : "-"}
                              </TableCell>
                              <TableCell rowSpan={lifts.length}>
                                {v.warrantyType ? (
                                  <div className="flex items-center gap-1 text-xs">
                                    {v.warrantyType === "warranty" ? (
                                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                                    ) : (
                                      <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                    )}
                                    <span className="capitalize">{v.warrantyType}</span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell rowSpan={lifts.length}>
                                {v.attachment ? (
                                  <div className="flex items-center gap-1 text-blue-600 text-xs">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-20">{v.attachment.name}</span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell rowSpan={lifts.length}>{v.approvedBy}</TableCell>
                              <TableCell rowSpan={lifts.length} className="font-mono">
                                {v.poNumber}
                              </TableCell>
                              <TableCell rowSpan={lifts.length}>₹{v.basicValue}</TableCell>
                              <TableCell rowSpan={lifts.length}>₹{v.totalWithTax}</TableCell>
                              <TableCell rowSpan={lifts.length}>
                                {v.poCopy ? (
                                  <div className="flex items-center gap-1 text-green-600 text-xs">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-20">{v.poCopy.name}</span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="font-mono">{lift.liftNumber}</TableCell>
                          <TableCell>{lift.liftingQty}</TableCell>
                          <TableCell>{lift.transporterName}</TableCell>
                          <TableCell>{lift.vehicleNumber || "-"}</TableCell>
                          <TableCell>{lift.contactNumber || "-"}</TableCell>
                          <TableCell>{lift.lrNumber}</TableCell>
                          <TableCell>
                            {lift.dispatchDate ? new Date(lift.dispatchDate).toLocaleDateString("en-IN") : "-"}
                          </TableCell>
                          <TableCell>₹{lift.freightAmount}</TableCell>
                          <TableCell>₹{lift.advanceAmount || "-"}</TableCell>
                          <TableCell>{lift.paymentDate ? new Date(lift.paymentDate).toLocaleDateString("en-IN") : "-"}</TableCell>
                          <TableCell>
                            {lift.biltyCopy ? (
                              <div className="flex items-center gap-1 text-green-600 text-xs">
                                <FileText className="w-3.5 h-3.5" />
                                <span className="truncate max-w-20">{lift.biltyCopy.name}</span>
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key={record.id} className="bg-yellow-50">
                        {baseColumns
                          .filter((c) => selectedColumns.includes(c.key))
                          .map((col) => (
                            <TableCell key={col.key}>{historyData[col.key] || "-"}</TableCell>
                          ))}
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>₹{v.rate || "-"}</TableCell>
                        <TableCell>
                          {paymentTermsList.find((t) => t.value === v.terms)?.label || v.terms || "-"}
                        </TableCell>
                        <TableCell>
                          {v.delivery ? new Date(v.delivery).toLocaleDateString("en-IN") : "-"}
                        </TableCell>
                        <TableCell>
                          {v.warrantyType ? (
                            <div className="flex items-center gap-1 text-xs">
                              {v.warrantyType === "warranty" ? (
                                <Shield className="w-3.5 h-3.5 text-blue-600" />
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                              )}
                              <span className="capitalize">{v.warrantyType}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {v.attachment ? (
                            <div className="flex items-center gap-1 text-blue-600 text-xs">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-20">{v.attachment.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{v.approvedBy}</TableCell>
                        <TableCell className="font-mono">{v.poNumber}</TableCell>
                        <TableCell>₹{v.basicValue}</TableCell>
                        <TableCell>₹{v.totalWithTax}</TableCell>
                        <TableCell>
                          {v.poCopy ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-20">{v.poCopy.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell colSpan={8} className="text-center text-yellow-700">
                          Follow-Up Scheduled
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* BULK MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Bulk Follow-Up & Dispatch</DialogTitle>
            <p className="text-sm text-gray-600">
              Update multiple indents at once.
            </p>
          </DialogHeader>

          <form onSubmit={handleBulkSubmit} className="flex-1 overflow-y-auto space-y-8 pr-2">
            {bulkFormData.map((item, recordIdx) => {
              const record = records.find((r) => r.id === item.recordId)!;
              const v = getVendorData(record);
              return (
                <div key={item.recordId} className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">Indent #{record.data.indentNumber}</h4>
                      <p className="text-sm text-gray-600">
                        {record.data.itemName} | Qty: {record.data.quantity} | Vendor: {v.name}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Status <span className="text-red-500">*</span></Label>
                      <Select
                        value={item.status}
                        onValueChange={(val) => {
                          setBulkFormData((prev) => {
                            const updated = [...prev];
                            updated[recordIdx] = {
                              ...updated[recordIdx],
                              status: val,
                              followUpDate: val === "follow-up" ? item.followUpDate : "",
                              remarks: val === "follow-up" ? item.remarks : "",
                              liftingData: val === "lift-material" ? item.liftingData : [],
                            };
                            return updated;
                          });
                        }}
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

                    {item.status === "follow-up" && (
                      <div className="grid grid-cols-2 gap-4 p-4 bg-yellow-50 rounded">
                        <div>
                          <Label>Next Follow-up Date <span className="text-red-500">*</span></Label>
                          <Input
                            type="date"
                            value={item.followUpDate}
                            onChange={(e) =>
                              setBulkFormData((prev) => {
                                const updated = [...prev];
                                updated[recordIdx].followUpDate = e.target.value;
                                return updated;
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Remarks <span className="text-red-500">*</span></Label>
                          <Textarea
                            value={item.remarks}
                            onChange={(e) =>
                              setBulkFormData((prev) => {
                                const updated = [...prev];
                                updated[recordIdx].remarks = e.target.value;
                                return updated;
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    )}

                    {item.status === "lift-material" && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">Lifting Entries</h5>
                          <Button type="button" size="sm" onClick={() => addLiftingEntry(recordIdx)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Lifting
                          </Button>
                        </div>

                        {item.liftingData.length === 0 ? (
                          <p className="text-sm text-gray-500">No lifting entries.</p>
                        ) : (
                          item.liftingData.map((lift, liftIdx) => (
                            <div key={liftIdx} className="border rounded p-4 bg-green-50 relative">
                              <button
                                type="button"
                                onClick={() => removeLiftingEntry(recordIdx, liftIdx)}
                                className="absolute top-2 right-2 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="font-mono text-lg mb-3">{lift.liftNumber}</div>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <Label>Lifting Qty *</Label>
                                  <Input
                                    type="number"
                                    value={lift.liftingQty}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "liftingQty", e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label>Transporter *</Label>
                                  <Select
                                    value={lift.transporterName}
                                    onValueChange={(val) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "transporterName", val)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {transporters.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Vehicle No *</Label>
                                  <Input
                                    value={lift.vehicleNumber}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "vehicleNumber", e.target.value.toUpperCase())
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label>Contact No *</Label>
                                  <Input
                                    value={lift.contactNumber}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "contactNumber", e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label>LR No *</Label>
                                  <Input
                                    value={lift.lrNumber}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "lrNumber", e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label>Dispatch Date *</Label>
                                  <Input
                                    type="date"
                                    value={lift.dispatchDate}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "dispatchDate", e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label>Freight Amt *</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={lift.freightAmount}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "freightAmount", e.target.value)
                                    }
                                    required
                                  />
                                </div>
                                <div>
                                  <Label>Advance Amt</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={lift.advanceAmount}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "advanceAmount", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label>Payment Date</Label>
                                  <Input
                                    type="date"
                                    value={lift.paymentDate}
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "paymentDate", e.target.value)
                                    }
                                  />
                                </div>
                                <div className="col-span-2">
                                  <Label>Bilty Copy *</Label>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.png"
                                    onChange={(e) =>
                                      updateLiftingEntry(recordIdx, liftIdx, "biltyCopy", e.target.files?.[0] || null)
                                    }
                                    className="hidden"
                                    id={`file-${recordIdx}-${liftIdx}`}
                                  />
                                  <label
                                    htmlFor={`file-${recordIdx}-${liftIdx}`}
                                    className="flex items-center justify-center w-full p-2 border-2 border-dashed border-green-300 rounded cursor-pointer text-sm"
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Bilty
                                  </label>
                                  {lift.biltyCopy && (
                                    <div className="mt-1 text-xs text-green-700 flex items-center gap-1">
                                      <FileText className="w-3.5 h-3.5" />
                                      {lift.biltyCopy.name}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </form>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button type="button" variant="outline" onClick={resetBulk}>
              Cancel
            </Button>
            <Button onClick={handleBulkSubmit} disabled={!isBulkValid}>
              Submit All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}