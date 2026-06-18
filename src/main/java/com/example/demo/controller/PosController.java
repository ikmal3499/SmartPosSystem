package com.example.demo.controller;

import com.example.demo.model.Item;
import com.example.demo.model.Receipt;
import com.example.demo.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = "*")
public class PosController {

    private final RecommendationService recommendationService;

    // Hardcoded products (in real app, get from DB)
    private static final List<Item> ALL_PRODUCTS = Arrays.asList(
        new Item("Coffee", 3.50, 0),
        new Item("Sandwich", 5.00, 0),
        new Item("Cake", 4.00, 0),
        new Item("Water", 1.50, 0)
    );

    PosController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/checkout")
    public Receipt checkout(@RequestBody List<Item> cart) {
        double total = cart.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        return new Receipt(total, cart);
    }

    @PostMapping("/recommendations")
    public List<Item> getRecommendations(@RequestBody List<Item> cart) {
        return recommendationService.getRecommendations(cart, ALL_PRODUCTS);
    }
}