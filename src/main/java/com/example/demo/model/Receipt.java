package com.example.demo.model;

import java.util.List;

public class Receipt {
    private double totalAmount;
    private List<Item> items;
    private String transactionId;

    public Receipt(double totalAmount, List<Item> items) {
        this.totalAmount = totalAmount;
        this.items = items;
        this.transactionId = "TXN-" + System.currentTimeMillis();
    }

    // Getters
    public double getTotalAmount() { return totalAmount; }
    public List<Item> getItems() { return items; }
    public String getTransactionId() { return transactionId; }
}