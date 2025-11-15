"use client";

import React, { useState, useEffect } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Upload } from "lucide-react";

export default function Stage1() {
  const {
    records,
    addRecord,
    moveToNextStage,
    indentCounter,
    setIndentCounter,
  } = useWorkflow();

  // === Existing Indent Creation Modal ===
  const [open, setOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);

  const [formData, setFormData] = useState({
    createdBy: "",
    warehouseLocation: "",
    leadTime: "",
    items: [] as Array<{
      category: string;
      itemName: string;
      quantity: string;
      deliveryDate: string;
    }>,
  });

  const [itemForm, setItemForm] = useState({
    items: [
      {
        category: "",
        itemName: "",
        quantity: "",
        deliveryDate: "",
      },
    ],
  });

  // === NEW: Separate Order Details Modal ===
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    orderNo: "",
    quotation: "",
    companyName: "",
    totalOrder: "",
    quantity: "",
    quotationCopy: null as File | null,
  });

  // Fill dummy data when Order modal opens
  useEffect(() => {
    if (orderModalOpen) {
      setOrderForm({
        orderNo: "ORD-2025-001",
        quotation: "QT-2025-045",
        companyName: "TechCorp Solutions",
        totalOrder: "₹1,25,000",
        quantity: "15",
        quotationCopy: null,
      });
    }
  }, [orderModalOpen]);

  const handleOrderChange = (field: string, value: string) => {
    setOrderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setOrderForm((prev) => ({ ...prev, quotationCopy: file }));
  };

  // === Existing Logic (Unchanged) ===
  const itemsByCategory = {
    electronics: ["Laptop", "Phone", "Tablet"],
    hardware: ["Screwdriver", "Hammer", "Drill"],
    software: ["License A", "License B"],
  };

  const createdByOptions = ["John Doe", "Jane Smith", "Bob Johnson"];

  const pending = records.filter(
    (r) => r.stage === 1 && r.status === "pending"
  );
  const history = records.filter((r) => r.history.some((h) => h.stage === 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.createdBy && formData.warehouseLocation && formData.leadTime && formData.items.length > 0) {
      formData.items.forEach((item, index) => {
        const indentNumber = `IN-${indentCounter
          .toString()
          .padStart(3, "0")}${String.fromCharCode(65 + index)}`;
        const newRecord = addRecord(1, {
          createdBy: formData.createdBy,
          warehouseLocation: formData.warehouseLocation,
          leadTime: formData.leadTime,
          indentNumber,
          ...item,
        });
        moveToNextStage(newRecord.id);
      });
      setIndentCounter((prev) => prev + 1);
      setFormData({ createdBy: "", warehouseLocation: "", leadTime: "", items: [] });
      setOpen(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      itemForm.items.every(
        (item) =>
          item.category &&
          item.itemName &&
          item.quantity &&
          item.deliveryDate
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, ...itemForm.items],
      }));
      setItemForm({
        items: [
          {
            category: "",
            itemName: "",
            quantity: "",
            deliveryDate: "",
          },
        ],
      });
      setAddItemOpen(false);
    }
  };

  const addNewItem = () => {
    setItemForm({
      ...itemForm,
      items: [
        ...itemForm.items,
        {
          category: "",
          itemName: "",
          quantity: "",
          deliveryDate: "",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (itemForm.items.length > 1) {
      setItemForm({
        ...itemForm,
        items: itemForm.items.filter((_, i) => i !== index),
      });
    }
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = itemForm.items.map((item, i) =>
      i === index
        ? field === "category"
          ? { ...item, [field]: value, itemName: "" }
          : { ...item, [field]: value }
        : item
    );
    setItemForm({ ...itemForm, items: updatedItems });
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-start">
        <Button onClick={() => setOrderModalOpen(true)} size="sm">
          + Create Order
        </Button>
      </div>
      {/* Stage Table */}
      <StageTable
        title="Stage 1: Create Indent"
        stage={1}
        pending={pending}
        history={history}
        onOpenForm={() => setOpen(true)}
        onSelectRecord={() => {}}
        showPending={true}
        columns={[
          { key: "indentNumber", label: "Indent #" },
          { key: "createdBy", label: "Created By" },
          { key: "warehouseLocation", label: "Warehouse" },
          { key: "leadTime", label: "Lead Time" },
          { key: "itemName", label: "Item" },
          { key: "quantity", label: "Qty" },
        ]}
      />

      {/* === SEPARATE ORDER DETAILS MODAL === */}
      <Dialog open={orderModalOpen} onOpenChange={setOrderModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Order No</Label>
                <Input
                  value={orderForm.orderNo}
                  onChange={(e) => handleOrderChange("orderNo", e.target.value)}
                  placeholder="e.g. ORD-2025-001"
                />
              </div>

              <div className="space-y-2">
                <Label>Quotation</Label>
                <Input
                  value={orderForm.quotation}
                  onChange={(e) => handleOrderChange("quotation", e.target.value)}
                  placeholder="e.g. QT-2025-045"
                />
              </div>

              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input
                  value={orderForm.companyName}
                  onChange={(e) => handleOrderChange("companyName", e.target.value)}
                  placeholder="e.g. TechCorp Solutions"
                />
              </div>

              <div className="space-y-2">
                <Label>Total Order</Label>
                <Input
                  value={orderForm.totalOrder}
                  onChange={(e) => handleOrderChange("totalOrder", e.target.value)}
                  placeholder="e.g. ₹1,25,000"
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={orderForm.quantity}
                  onChange={(e) => handleOrderChange("quantity", e.target.value)}
                  placeholder="e.g. 15"
                />
              </div>

              <div className="space-y-2">
                <Label>Quotation Copy</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {orderForm.quotationCopy && (
                    <div className="flex items-center text-xs text-green-600 font-medium">
                      <Upload className="w-3 h-3 mr-1" />
                      {orderForm.quotationCopy.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === ORIGINAL INDENT CREATION MODAL (UNCHANGED) === */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-4 sm:p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Indent</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="createdBy">Created By</Label>
                <Select
                  value={formData.createdBy}
                  onValueChange={(val) =>
                    setFormData({ ...formData, createdBy: val })
                  }
                >
                  <SelectTrigger id="createdBy">
                    <SelectValue placeholder="Select creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {createdByOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouseLocation">Warehouse Location</Label>
                <Select
                  value={formData.warehouseLocation}
                  onValueChange={(val) =>
                    setFormData({ ...formData, warehouseLocation: val })
                  }
                >
                  <SelectTrigger id="warehouseLocation">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                    <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadTime">Lead Time (Days)</Label>
                <Input
                  id="leadTime"
                  type="number"
                  min="1"
                  placeholder="e.g. 7"
                  value={formData.leadTime}
                  onChange={(e) =>
                    setFormData({ ...formData, leadTime: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button type="button" onClick={() => setAddItemOpen(true)} size="sm">
                    Add Item
                  </Button>
                </div>

                {formData.items.length === 0 ? (
                  <div className="p-4 sm:p-6 text-center border rounded-lg border-dashed">
                    <p className="text-sm text-gray-500">
                      No items added yet. Click "Add Item" to begin.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">
                                {item.itemName}
                              </span>
                            </div>
                            <div>
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <div>
                              <span>Qty: {item.quantity}</span>
                            </div>
                            <div className="col-span-2">
                              <span>
                                Delivery: {new Date(
                                  item.deliveryDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                items: formData.items.filter((_, i) => i !== index),
                              });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>

          <DialogFooter className="flex-shrink-0 border-t pt-3 flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.createdBy || !formData.warehouseLocation || !formData.leadTime || formData.items.length === 0}
              onClick={handleSubmit}
              className="w-full sm:w-auto"
            >
              Create Indent ({formData.items.length} item
              {formData.items.length !== 1 ? "s" : ""})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === ADD ITEM SUB-MODAL (UNCHANGED) === */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-4 sm:p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add Multiple Items</DialogTitle>
            <p className="text-sm text-gray-600">
              Add one or more items to the indent.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            <form onSubmit={handleAddItem} className="space-y-3">
              {itemForm.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-3 relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-sm">Item {index + 1}</h3>
                    {itemForm.items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 h-8"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={item.category}
                        onValueChange={(val) =>
                          updateItem(index, "category", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Select
                        value={item.itemName}
                        onValueChange={(val) =>
                          updateItem(index, "itemName", val)
                        }
                        disabled={!item.category}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              item.category
                                ? "Select item"
                                : "Select category first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {item.category &&
                            itemsByCategory[
                              item.category as keyof typeof itemsByCategory
                            ]?.map((itemName) => (
                              <SelectItem key={itemName} value={itemName}>
                                {itemName}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 5"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Expected Delivery Date</Label>
                      <Input
                        type="date"
                        value={item.deliveryDate}
                        onChange={(e) =>
                          updateItem(index, "deliveryDate", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewItem}
                  className="w-full"
                  size="sm"
                >
                  + Add Another Item
                </Button>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddItemOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Add {itemForm.items.length} Item
                  {itemForm.items.length > 1 ? "s" : ""} to Indent
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}