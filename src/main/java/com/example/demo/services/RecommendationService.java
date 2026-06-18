package com.example.demo.services;

import com.example.demo.model.Item;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationService {
    
    // AI Rule Engine - Product relationships
    private static final Map<String, List<String>> PRODUCT_RELATIONSHIPS = Map.of(
        "Coffee", Arrays.asList("Cake", "Sandwich"),
        "Sandwich", Arrays.asList("Coffee", "Water"),
        "Cake", Arrays.asList("Coffee", "Water"),
        "Water", Arrays.asList("Sandwich", "Cake")
    );
    
    public List<Item> getRecommendations(List<Item> cart, List<Item> allProducts) {
        if (cart.isEmpty()) return Collections.emptyList();
        
        // Count frequency of recommended items
        Map<String, Integer> recommendationScores = new HashMap<>();
        
        for (Item cartItem : cart) {
            List<String> relatedProducts = PRODUCT_RELATIONSHIPS.get(cartItem.getName());
            if (relatedProducts != null) {
                for (String related : relatedProducts) {
                    // Don't recommend items already in cart
                    boolean inCart = cart.stream().anyMatch(i -> i.getName().equals(related));
                    if (!inCart) {
                        recommendationScores.put(related, 
                            recommendationScores.getOrDefault(related, 0) + 1);
                    }
                }
            }
        }
        
        // Sort by score and get top 2 recommendations
        List<Item> recommendations = new ArrayList<>();
        recommendationScores.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(2)
            .forEach(entry -> {
                allProducts.stream()
                    .filter(p -> p.getName().equals(entry.getKey()))
                    .findFirst()
                    .ifPresent(recommendations::add);
            });
        
        return recommendations;
    }
}