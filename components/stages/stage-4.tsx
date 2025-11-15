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
import { CheckCircle2, FileText, Image, Shield, ShieldCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Stage4() {
  const { records, moveToNextStage, updateRecord } = useWorkflow();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    selectedVendor: "",
    approvedBy: "",
    remarks: "",
  });

  const approvers = ["John Doe", "Jane Smith", "Bob Johnson"];

  const pending = records.filter((r) => r.stage === 4 && r.status === "pending");
  const completed = records.filter((r) => r.history.some((h) => h.stage === 4));

  const baseColumns = [
    { key: "indentNumber", label: "Indent #", icon: null },
    { key: "itemName", label: "Item", icon: null },
    { key: "quantity", label: "Qty", icon: null },
  ];

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    baseColumns.map((c) => c.key)
  );

  const paymentTerms = [
    { value: "15", label: "15 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "advance", label: "Advance" },
    { value: "PI", label: "PI (Proforma Invoice)" },
  ];

  const handleOpenForm = (recordId: string) => {
    const record = records.find((r) => r.id === recordId);
    if (!record) return;

    setSelectedRecord(recordId);
    setCurrentRecord(record);
    setFormData({ selectedVendor: "", approvedBy: "", remarks: "" });

    if (!record.data.vendor2Name) {
      updateRecord(recordId, {
        autoSkipped: true,
        selectedVendor: "vendor1",
        approvedBy: "Auto-Approved",
      });
      moveToNextStage(recordId);
      return;
    }

    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord && formData.selectedVendor && formData.approvedBy) {
      updateRecord(selectedRecord, { ...formData });
      moveToNextStage(selectedRecord);
      resetForm();
    }
  };

  const resetForm = () => {
    setOpen(false);
    setSelectedRecord(null);
    setCurrentRecord(null);
    setFormData({ selectedVendor: "", approvedBy: "", remarks: "" });
  };

  const getVendors = (record: any) => {
    return Array.from({ length: 3 }, (_, i) => {
      const idx = i + 1;
      const name = record.data[`vendor${idx}Name`];
      if (!name) return null;
      return {
        id: `vendor${idx}`,
        name,
        rate: record.data[`vendor${idx}Rate`],
        terms: record.data[`vendor${idx}Terms`],
        delivery: record.data[`vendor${idx}DeliveryDate`],
        warrantyType: record.data[`vendor${idx}WarrantyType`],
        warrantyFrom: record.data[`vendor${idx}WarrantyFrom`],
        warrantyTo: record.data[`vendor${idx}WarrantyTo`],
        attachment: record.data[`vendor${idx}Attachment`],
      };
    }).filter(Boolean);
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

  const vendors = currentRecord ? getVendors(currentRecord) : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 p-6 bg-white border rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Stage 4: Vendor Negotiation</h2>
            <p className="text-gray-600 mt-1">Compare quotes and select the best vendor</p>
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
              <p className="text-lg">No pending negotiations</p>
              <p className="text-sm mt-1">All caught up!</p>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((record) => {
                    const vendors = getVendors(record);
                    return vendors.map((v, idx) => (
                      <TableRow key={`${record.id}-v${idx + 1}`}>
                        {idx === 0 && (
                          <>
                            {baseColumns
                              .filter((c) => selectedColumns.includes(c.key))
                              .map((col) => (
                                <TableCell key={col.key} rowSpan={vendors.length}>
                                  {record.data[col.key] || "-"}
                                </TableCell>
                              ))}
                          </>
                        )}
                        <TableCell>{v.name}</TableCell>
                        <TableCell>₹{v.rate || "-"}</TableCell>
                        <TableCell>
                          {paymentTerms.find((t) => t.value === v.terms)?.label || v.terms || "-"}
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
                              {v.attachment.type?.startsWith("image/") ? (
                                <Image className="w-3.5 h-3.5" />
                              ) : (
                                <FileText className="w-3.5 h-3.5" />
                              )}
                              <span className="truncate max-w-24">{v.attachment.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        {idx === 0 && (
                          <TableCell rowSpan={vendors.length} className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenForm(record.id)}
                            >
                              Negotiate
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No completed negotiations</p>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((record) => {
                    const selectedId = record.data.selectedVendor || "vendor1";
                    const idx = parseInt(selectedId.replace("vendor", ""), 10) || 1;
                    const v = {
                      name: record.data[`vendor${idx}Name`] || "-",
                      rate: record.data[`vendor${idx}Rate`],
                      terms: record.data[`vendor${idx}Terms`],
                      delivery: record.data[`vendor${idx}DeliveryDate`],
                      warrantyType: record.data[`vendor${idx}WarrantyType`],
                      warrantyFrom: record.data[`vendor${idx}WarrantyFrom`],
                      warrantyTo: record.data[`vendor${idx}WarrantyTo`],
                      attachment: record.data[`vendor${idx}Attachment`],
                      approvedBy: record.data.approvedBy || "Auto-Approved",
                    };

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
                          {paymentTerms.find((t) => t.value === v.terms)?.label || v.terms || "-"}
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
                              {v.attachment.type?.startsWith("image/") ? (
                                <Image className="w-3.5 h-3.5" />
                              ) : (
                                <FileText className="w-3.5 h-3.5" />
                              )}
                              <span className="truncate max-w-24">{v.attachment.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{v.approvedBy}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Vendor Negotiation & Final Selection</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* 1. SELECT VENDOR FIRST */}
            <div className="space-y-3 border-b pb-4">
              <Label className="text-lg font-semibold">
                Select Vendor <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vendors.map((v) => (
                  <label
                    key={v.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.selectedVendor === v.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedVendor"
                      value={v.id}
                      checked={formData.selectedVendor === v.id}
                      onChange={(e) => setFormData({ ...formData, selectedVendor: e.target.value })}
                      className="mr-3"
                    />
                    <span className="font-medium">{v.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. APPROVED BY */}
            <div className="space-y-2">
              <Label htmlFor="approvedBy">
                Approved By <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.approvedBy}
                onValueChange={(v) => setFormData({ ...formData, approvedBy: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select approver..." />
                </SelectTrigger>
                <SelectContent>
                  {approvers.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. ITEM DETAILS (NO DUPLICATE) */}
            <div className="border rounded-lg p-4 bg-gray-50">
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

            {/* 4. COMPARISON SHEET */}
            <div className="border rounded-lg">
              <div className="p-4 border-b bg-muted/50">
                <h3 className="font-medium">Vendor Comparison Sheet</h3>
              </div>
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Rate/Qty</TableHead>
                      <TableHead>Payment Terms</TableHead>
                      <TableHead>Exp. Delivery</TableHead>
                      <TableHead>Warranty</TableHead>
                      <TableHead>Attachment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((v) => (
                      <TableRow
                        key={v.id}
                        className={formData.selectedVendor === v.id ? "bg-blue-50" : ""}
                      >
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell>₹{v.rate || "-"}</TableCell>
                        <TableCell>
                          {paymentTerms.find((t) => t.value === v.terms)?.label || v.terms || "-"}
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
                              {v.warrantyFrom && v.warrantyTo && (
                                <span className="text-gray-500 ml-1">
                                  ({new Date(v.warrantyFrom).toLocaleDateString("en-IN")} -{" "}
                                  {new Date(v.warrantyTo).toLocaleDateString("en-IN")})
                                </span>
                              )}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {v.attachment ? (
                            <div className="flex items-center gap-1 text-blue-600 text-xs">
                              {v.attachment.type?.startsWith("image/") ? (
                                <Image className="w-3.5 h-3.5" />
                              ) : (
                                <FileText className="w-3.5 h-3.5" />
                              )}
                              <span className="truncate max-w-20">{v.attachment.name}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 5. REMARKS */}
            <div className="space-y-2">
              <Label htmlFor="remarks">Negotiation Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Any special terms, discounts, or notes..."
                className="min-h-24"
              />
            </div>
          </form>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!formData.selectedVendor || !formData.approvedBy}
            >
              Confirm & Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}