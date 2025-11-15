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
  Calendar,
  FileText,
  Package,
  Warehouse,
  User,
  Hash,
  Upload,
  X,
  Shield,
  ShieldCheck,
  DollarSign,
  Clock,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
    vendor1Attachment: null as File | null,
    vendor1WarrantyType: "",
    vendor1WarrantyFrom: "",
    vendor1WarrantyTo: "",
    vendor2Name: "",
    vendor2Rate: "",
    vendor2Terms: "",
    vendor2DeliveryDate: "",
    vendor2Attachment: null as File | null,
    vendor2WarrantyType: "",
    vendor2WarrantyFrom: "",
    vendor2WarrantyTo: "",
    vendor3Name: "",
    vendor3Rate: "",
    vendor3Terms: "",
    vendor3DeliveryDate: "",
    vendor3Attachment: null as File | null,
    vendor3WarrantyType: "",
    vendor3WarrantyFrom: "",
    vendor3WarrantyTo: "",
  });

  const isThirdParty = currentRecord?.data?.vendorType === "third party";
  const numVendors = isThirdParty ? 3 : 1;

  const pending = records.filter(
    (r) => r.stage === 3 && r.status === "pending"
  );

  const completed = records.filter((r) =>
    r.history.some((h) => h.stage === 3)
  );

  const baseColumns = [
    { key: "indentNumber", label: "Indent #", icon: Hash },
    { key: "createdBy", label: "Created By", icon: User },
    { key: "category", label: "Category", icon: FileText },
    { key: "itemName", label: "Item", icon: Package },
    { key: "quantity", label: "Qty", icon: Package },
    { key: "warehouseLocation", label: "Warehouse", icon: Warehouse },
    { key: "leadTime", label: "Lead Time", icon: Clock },
    { key: "deliveryDate", label: "Exp. Delivery", icon: Calendar },
  ] as const;

  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    baseColumns.map((c) => c.key)
  );

  const vendorOptions = [
    "Acme Suppliers Ltd.",
    "Global Traders Inc.",
    "Metro Distributors",
    "Prime Industrial Co.",
    "Sigma Enterprises",
  ];

  const paymentTerms = [
    { value: "15", label: "15 days" },
    { value: "30", label: "30 days" },
    { value: "60", label: "60 days" },
    { value: "90", label: "90 days" },
    { value: "advance", label: "Advance" },
    { value: "PI", label: "PI (Proforma Invoice)" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecord && vendorCount >= numVendors) {
      updateRecord(selectedRecord, { ...formData });

      if (isThirdParty) {
        moveToNextStage(selectedRecord);
      } else {
        moveToNextStage(selectedRecord);
        moveToNextStage(selectedRecord);
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
      vendor1Name: "", vendor1Rate: "", vendor1Terms: "", vendor1DeliveryDate: "", vendor1Attachment: null,
      vendor1WarrantyType: "", vendor1WarrantyFrom: "", vendor1WarrantyTo: "",
      vendor2Name: "", vendor2Rate: "", vendor2Terms: "", vendor2DeliveryDate: "", vendor2Attachment: null,
      vendor2WarrantyType: "", vendor2WarrantyFrom: "", vendor2WarrantyTo: "",
      vendor3Name: "", vendor3Rate: "", vendor3Terms: "", vendor3DeliveryDate: "", vendor3Attachment: null,
      vendor3WarrantyType: "", vendor3WarrantyFrom: "", vendor3WarrantyTo: "",
    });
  };

  const handleOpenForm = (recordId: string) => {
    const rec = records.find((r) => r.id === recordId);
    if (rec) {
      setSelectedRecord(recordId);
      setCurrentRecord(rec);
      setOpen(true);
      setVendorCount(0);
    }
  };

  useEffect(() => {
    let filled = 0;
    for (let i = 1; i <= numVendors; i++) {
      if (formData[`vendor${i}Name` as keyof typeof formData]) filled++;
    }
    setVendorCount(filled);
  }, [formData, numVendors]);

  const handleFileRemove = (n: number) => {
    setFormData({ ...formData, [`vendor${n}Attachment`]: null });
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
              <p className="text-lg">No pending vendor updates</p>
              <p className="text-sm mt-1">All quotes received!</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {baseColumns
                      .filter((c) => selectedColumns.includes(c.key))
                      .map((col) => (
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
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      {baseColumns
                        .filter((c) => selectedColumns.includes(c.key))
                        .map((col) => (
                          <TableCell key={col.key}>
                            {col.key === "deliveryDate"
                              ? new Date(record.data[col.key]).toLocaleDateString("en-IN")
                              : col.key === "leadTime"
                              ? `${record.data[col.key] ?? "-"} days`
                              : String(record.data[col.key] ?? "-")}
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

        {/* HISTORY – FULL VENDOR DATA */}
        <TabsContent value="history" className="mt-6">
          {completed.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No completed records</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Indent #</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Rate/Qty</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Exp. Delivery</TableHead>
                    <TableHead>Warranty/Guarantee</TableHead>
                    <TableHead>Attachment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completed.map((record) => {
                    const vendors = [];
                    for (let i = 1; i <= 3; i++) {
                      const name = record.data[`vendor${i}Name`];
                      if (name) {
                        vendors.push({
                          name,
                          rate: record.data[`vendor${i}Rate`],
                          terms: record.data[`vendor${i}Terms`],
                          delivery: record.data[`vendor${i}DeliveryDate`],
                          warrantyType: record.data[`vendor${i}WarrantyType`],
                          warrantyFrom: record.data[`vendor${i}WarrantyFrom`],
                          warrantyTo: record.data[`vendor${i}WarrantyTo`],
                          attachment: record.data[`vendor${i}Attachment`],
                        });
                      }
                    }

                    return vendors.map((v, idx) => (
                      <TableRow key={`${record.id}-v${idx + 1}`}>
                        {idx === 0 && (
                          <>
                            <TableCell rowSpan={vendors.length}>
                              {record.data.indentNumber}
                            </TableCell>
                            <TableCell rowSpan={vendors.length}>
                              {record.data.itemName}
                            </TableCell>
                            <TableCell rowSpan={vendors.length}>
                              {record.data.quantity}
                            </TableCell>
                          </>
                        )}
                        <TableCell>{v.name}</TableCell>
                        <TableCell>
                          {v.rate ? `₹${parseFloat(v.rate).toFixed(2)}` : "-"}
                        </TableCell>
                        <TableCell>
                          {paymentTerms.find((t) => t.value === v.terms)?.label || v.terms || "-"}
                        </TableCell>
                        <TableCell>
                          {v.delivery ? new Date(v.delivery).toLocaleDateString("en-IN") : "-"}
                        </TableCell>
                        <TableCell>
                          {v.warrantyType ? (
                            <div className="flex flex-col text-xs">
                              <div className="flex items-center gap-1">
                                {v.warrantyType === "warranty" ? (
                                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                                ) : (
                                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                )}
                                <span className="font-medium capitalize">{v.warrantyType}</span>
                              </div>
                              {v.warrantyFrom && v.warrantyTo && (
                                <span className="text-gray-500">
                                  {new Date(v.warrantyFrom).toLocaleDateString("en-IN")} –{" "}
                                  {new Date(v.warrantyTo).toLocaleDateString("en-IN")}
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
                              <FileText className="w-3.5 h-3.5" />
                              <span className="truncate max-w-32">
                                {v.attachment.name}
                              </span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ));
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
            <DialogTitle>Update {numVendors} Vendor{numVendors > 1 ? "s" : ""}</DialogTitle>
            <p className="text-sm text-gray-600">
              {isThirdParty
                ? "Enter details for 3 different vendors"
                : "Enter details for the selected vendor"}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Item Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium mb-3">Item Details</h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
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
                <div>
                  <span className="font-medium">Warehouse:</span>
                  <p>{currentRecord?.data?.warehouseLocation || "—"}</p>
                </div>
              </div>
            </div>

            {/* Vendor Forms */}
            {Array.from({ length: numVendors }, (_, i) => i + 1).map((num) => {
              const warrantyType = formData[`vendor${num}WarrantyType` as keyof typeof formData];
              return (
                <div key={num} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Vendor {num}
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`vendor${num}Name`}>
                        Vendor Name <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData[`vendor${num}Name` as keyof typeof formData]}
                        onValueChange={(v) =>
                          setFormData({ ...formData, [`vendor${num}Name`]: v })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {vendorOptions.map((v) => (
                            <SelectItem key={v} value={v}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`vendor${num}Rate`}>
                        Rate per Qty <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`vendor${num}Rate`}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={formData[`vendor${num}Rate` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`vendor${num}Rate`]: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`vendor${num}Terms`}>
                        Payment Terms <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData[`vendor${num}Terms` as keyof typeof formData]}
                        onValueChange={(v) =>
                          setFormData({ ...formData, [`vendor${num}Terms`]: v })
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentTerms.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`vendor${num}DeliveryDate`}>
                        Expected Delivery <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`vendor${num}DeliveryDate`}
                        type="date"
                        value={formData[`vendor${num}DeliveryDate` as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData({ ...formData, [`vendor${num}DeliveryDate`]: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Warranty / Guarantee</Label>
                      <Select
                        value={warrantyType}
                        onValueChange={(v) =>
                          setFormData({ ...formData, [`vendor${num}WarrantyType`]: v })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warranty">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" /> Warranty
                            </div>
                          </SelectItem>
                          <SelectItem value="guarantee">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" /> Guarantee
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {warrantyType && (
                      <>
                        <div className="space-y-2">
                          <Label>From</Label>
                          <Input
                            type="date"
                            value={formData[`vendor${num}WarrantyFrom` as keyof typeof formData]}
                            onChange={(e) =>
                              setFormData({ ...formData, [`vendor${num}WarrantyFrom`]: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>To</Label>
                          <Input
                            type="date"
                            value={formData[`vendor${num}WarrantyTo` as keyof typeof formData]}
                            onChange={(e) =>
                              setFormData({ ...formData, [`vendor${num}WarrantyTo`]: e.target.value })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label>Attachment</Label>
                    <div>
                      <input
                        id={`file-${num}`}
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
                        htmlFor={`file-${num}`}
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                      >
                        <Upload className="w-5 h-5 mr-2 text-gray-500" />
                        <span className="text-sm">Click to upload</span>
                      </label>

                      {formData[`vendor${num}Attachment` as keyof typeof formData] && (
                        <div className="mt-2 p-2 bg-gray-50 border rounded flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>
                              {(formData[`vendor${num}Attachment` as keyof typeof formData] as File).name}
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
              );
            })}

            <div className="flex items-center justify-center gap-3 py-4">
              <span className="font-medium">Vendors Filled:</span>
              <div className="flex gap-1">
                {Array.from({ length: 3 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < vendorCount ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{vendorCount} / {numVendors}</span>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={vendorCount < numVendors}>
                Submit {numVendors} Vendor{numVendors > 1 ? "s" : ""}
              </Button>
            </div>
          </form>

          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}