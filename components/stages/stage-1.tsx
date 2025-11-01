"use client";

import React, { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { StageTable } from "./stage-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { X } from "lucide-react";

export default function Stage1() {
  const {
    records,
    addRecord,
    moveToNextStage,
    indentCounter,
    setIndentCounter,
  } = useWorkflow();

  const [open, setOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [formData, setFormData] = useState({
    createdBy: "",
    items: [] as Array<{
      category: string;
      itemName: string;
      quantity: string;
      warehouse: string;
      deliveryDate: string;
    }>,
  });

  const [itemForm, setItemForm] = useState({
    items: [
      {
        category: "",
        itemName: "",
        quantity: "",
        warehouse: "",
        deliveryDate: "",
      },
    ],
  });

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
    if (formData.createdBy && formData.items.length > 0) {
      formData.items.forEach((item, index) => {
        const indentNumber = `IN-${indentCounter
          .toString()
          .padStart(3, "0")}${String.fromCharCode(65 + index)}`;
        const newRecord = addRecord(1, {
          createdBy: formData.createdBy,
          indentNumber,
          ...item,
        });
        moveToNextStage(newRecord.id);
      });
      setIndentCounter((prev) => prev + 1);
      setFormData({ createdBy: "", items: [] });
      setOpen(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      itemForm.items.every((item) => item.category && item.itemName && item.quantity && item.warehouse && item.deliveryDate)
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
            warehouse: "",
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
          warehouse: "",
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
          ? { ...item, [field]: value, itemName: "" } // Reset itemName when category changes
          : { ...item, [field]: value }
        : item
    );
    setItemForm({ ...itemForm, items: updatedItems });
  };

  return (
    <>
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
          { key: "itemName", label: "Item" },
          { key: "quantity", label: "Qty" },
        ]}
      />

      {/* Main Indent Creation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Indent</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Created By */}
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

              {/* Items Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button
                    type="button"
                    onClick={() => setAddItemOpen(true)}
                  >
                    Add Item
                  </Button>
                </div>

                {formData.items.length === 0 ? (
                  <div className="p-8 text-center border rounded-lg border-dashed">
                    <p className="text-gray-500">
                      No items added yet. Click "Add Item" to begin.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium">{item.itemName}</span>
                            </div>
                            <div>
                              <Badge variant="secondary" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            <div>
                              <span>Qty: {item.quantity}</span>
                            </div>
                            <div>
                              <span>{item.warehouse}</span>
                            </div>
                            <div className="col-span-2">
                              <span>{new Date(item.deliveryDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(index)}
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

          {/* Actions - Fixed at bottom */}
          <DialogFooter className="flex-shrink-0 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.createdBy || formData.items.length === 0}
              onClick={handleSubmit}
            >
              Create Indent ({formData.items.length} item
              {formData.items.length !== 1 ? "s" : ""})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Add Multiple Items</DialogTitle>
            <p className="text-sm text-gray-600">
              Add one or more items to the indent.
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            <form onSubmit={handleAddItem} className="space-y-6">
              {itemForm.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Item {index + 1}</h3>
                    {itemForm.items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select
                        value={item.category}
                        onValueChange={(val) => updateItem(index, "category", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Item Name */}
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Select
                        value={item.itemName}
                        onValueChange={(val) => updateItem(index, "itemName", val)}
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

                    {/* Quantity */}
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

                    {/* Warehouse */}
                    <div className="space-y-2">
                      <Label>Warehouse Location</Label>
                      <Select
                        value={item.warehouse}
                        onValueChange={(val) => updateItem(index, "warehouse", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                          <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                          <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Delivery Date */}
                    <div className="space-y-2 col-span-2">
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

              {/* Add Another Item Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addNewItem}
                  className="w-full"
                >
                  + Add Another Item
                </Button>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddItemOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add {itemForm.items.length} Item{itemForm.items.length > 1 ? "s" : ""} to Indent
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}