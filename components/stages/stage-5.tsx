"use client";

import React, { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload, X, Shield, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Stage5() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [bulkFormData, setBulkFormData] = useState<Record<string, any>>({});

  const pending = records.filter((r) => r.stage === 5 && r.status === "pending");
  const completed = records.filter((r) => r.history.some((h) => h.stage === 5));

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

  const handleOpenBulkForm = () => {
    if (selectedRecordIds.length === 0) return;

    const initialData: Record<string, any> = {};
    selectedRecordIds.forEach((id) => {
      initialData[id] = {
        poNumber: "",
        basicValue: "",
        totalWithTax: "",
        paymentTerms: "",
        remarks: "",
        poCopy: null as File | null,
      };
    });
    setBulkFormData(initialData);
    setOpen(true);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let allValid = true;

    selectedRecordIds.forEach((id) => {
      const data = bulkFormData[id];
      if (!data.poNumber || !data.basicValue || !data.totalWithTax || !data.paymentTerms) {
        allValid = false;
      }
    });

    if (!allValid) return;

    selectedRecordIds.forEach((id) => {
      updateRecord(id, bulkFormData[id]);
      moveToNextStage(id);
    });

    setOpen(false);
    setSelectedRecordIds([]);
    setBulkFormData({});
  };

  const handleFileChange = (recordId: string, file: File | null) => {
    setBulkFormData((prev) => ({
      ...prev,
      [recordId]: { ...prev[recordId], poCopy: file },
    }));
  };

  const handleFileRemove = (recordId: string) => {
    setBulkFormData((prev) => ({
      ...prev,
      [recordId]: { ...prev[recordId], poCopy: null },
    }));
  };

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
    };
  };

  const toggleSelectAll = () => {
    if (selectedRecordIds.length === pending.length) {
      setSelectedRecordIds([]);
    } else {
      setSelectedRecordIds(pending.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedRecordIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const ColumnSelector = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-64 justify-start">
          {selectedColumns.length === baseColumns.length
            ? "All columns"
            : `${selectedColumns.length} column${selectedColumns.length > 1 ? "s" : ""} selected`}
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
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 5: PO Creation</h2>
            <p className="text-gray-600 mt-1">Generate and attach purchase orders</p>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Show Columns:</Label>
            <ColumnSelector />
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
              <p className="text-lg">No pending PO entries</p>
              <p className="text-sm mt-1">All purchase orders are created!</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedRecordIds.length} item{selectedRecordIds.length !== 1 ? "s" : ""} selected
                </p>
                <Button
                  onClick={handleOpenBulkForm}
                  disabled={selectedRecordIds.length === 0}
                  size="sm"
                >
                  Create PO for Selected
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRecordIds.length === pending.length && pending.length > 0}
                          onCheckedChange={toggleSelectAll}
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((record) => {
                      const v = getVendorData(record);
                      const isSelected = selectedRecordIds.includes(record.id);
                      return (
                        <TableRow
                          key={record.id}
                          className={isSelected ? "bg-blue-50" : ""}
                        >
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelectOne(record.id)}
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
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No completed POs</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((record) => {
                    const v = getVendorData(record);
                    return (
                      <TableRow key={record.id} className="bg-green-50">
                        {baseColumns
                          .filter((c) => selectedColumns.includes(c.key))
                          .map((col) => (
                            <TableCell key={col.key}>{record.data[col.key] || "-"}</TableCell>
                          ))}
                        <TableCell className="font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {v.name}
                        </TableCell>
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
                        <TableCell className="font-mono">{record.data.poNumber || "-"}</TableCell>
                        <TableCell>₹{record.data.basicValue || "-"}</TableCell>
                        <TableCell>₹{record.data.totalWithTax || "-"}</TableCell>
                        <TableCell>
                          {record.data.poCopy ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-20">{record.data.poCopy.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
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

      {/* BULK PO MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Bulk PO Creation ({selectedRecordIds.length} items)</DialogTitle>
            <p className="text-sm text-gray-600">Fill PO details for all selected items</p>
          </DialogHeader>

          <form onSubmit={handleBulkSubmit} className="flex-1 overflow-y-auto space-y-8 pr-2">
            {selectedRecordIds.map((recordId) => {
              const record = records.find((r) => r.id === recordId);
              if (!record) return null;
              const v = getVendorData(record);
              const data = bulkFormData[recordId] || {};

              return (
                <div key={recordId} className="border rounded-lg p-4 bg-gray-50">
                  <div className="mb-4 pb-3 border-b">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div><strong>Indent #:</strong> {record.data.indentNumber}</div>
                      <div><strong>Item:</strong> {record.data.itemName}</div>
                      <div><strong>Qty:</strong> {record.data.quantity}</div>
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      Vendor: <span className="font-medium">{v.name}</span> | Rate: ₹{v.rate}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${recordId}-poNumber`}>
                        PO Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`${recordId}-poNumber`}
                        value={data.poNumber || ""}
                        onChange={(e) =>
                          setBulkFormData((prev) => ({
                            ...prev,
                            [recordId]: { ...prev[recordId], poNumber: e.target.value },
                          }))
                        }
                        required
                        placeholder="PO-2025-001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${recordId}-basicValue`}>
                        Basic Value <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`${recordId}-basicValue`}
                        type="number"
                        step="0.01"
                        value={data.basicValue || ""}
                        onChange={(e) =>
                          setBulkFormData((prev) => ({
                            ...prev,
                            [recordId]: { ...prev[recordId], basicValue: e.target.value },
                          }))
                        }
                        required
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${recordId}-totalWithTax`}>
                        Total With Tax <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`${recordId}-totalWithTax`}
                        type="number"
                        step="0.01"
                        value={data.totalWithTax || ""}
                        onChange={(e) =>
                          setBulkFormData((prev) => ({
                            ...prev,
                            [recordId]: { ...prev[recordId], totalWithTax: e.target.value },
                          }))
                        }
                        required
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`${recordId}-paymentTerms`}>
                        Payment Terms <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`${recordId}-paymentTerms`}
                        value={data.paymentTerms || ""}
                        onChange={(e) =>
                          setBulkFormData((prev) => ({
                            ...prev,
                            [recordId]: { ...prev[recordId], paymentTerms: e.target.value },
                          }))
                        }
                        required
                        placeholder="50% Advance"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label>PO Copy</Label>
                    <div>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(recordId, e.target.files?.[0] || null)}
                        className="hidden"
                        id={`file-${recordId}`}
                      />
                      <label
                        htmlFor={`file-${recordId}`}
                        className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 text-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload PO copy
                      </label>
                      {data.poCopy && (
                        <div className="mt-2 p-2 bg-white border rounded flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{data.poCopy.name}</span>
                            <span className="text-gray-500">
                              ({(data.poCopy.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFileRemove(recordId)}
                            className="text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`${recordId}-remarks`}>Remarks</Label>
                    <Textarea
                      id={`${recordId}-remarks`}
                      value={data.remarks || ""}
                      onChange={(e) =>
                        setBulkFormData((prev) => ({
                          ...prev,
                          [recordId]: { ...prev[recordId], remarks: e.target.value },
                        }))
                      }
                      placeholder="Any notes..."
                      className="mt-1"
                    />
                  </div>
                </div>
              );
            })}
          </form>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkSubmit}
              disabled={
                selectedRecordIds.length === 0 ||
                !selectedRecordIds.every((id) => {
                  const d = bulkFormData[id];
                  return d?.poNumber && d?.basicValue && d?.totalWithTax && d?.paymentTerms;
                })
              }
            >
              Create {selectedRecordIds.length} PO{selectedRecordIds.length > 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}