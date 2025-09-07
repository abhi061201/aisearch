# AI Product Advisor - Development Prompts

This document contains all the important prompts and requests that shaped the development of the AI Product Advisor React Native application.

## 🎯 Initial Project Requirements

### Core Assignment Prompt

```
Assignment: The Goal: We want to move beyond traditional keyword search. Your task is to design and build a React Native application that acts as an "AI Product Advisor." A user should be able to describe their needs in plain English, and the application should intelligently recommend the best products for them.

Core Requirements:
1. Build a React Native Application: Create a user interface where a user can input a natural language query (e.g., "I need a lightweight laptop for travel with a long battery life").
2. Use the Provided Catalog: We have provided a sample PRODUCT_CATALOG (as a JavaScript array of objects). Your app should use this as its "database" of available products.
3. Integrate a Generative AI Model: When the user submits their query, your application must make an API call to a large language model (e.g., Google's Gemini). You will need to construct a prompt that enables the AI to compare the user's request against the product catalog.
4. Display the Recommendations: Creatively display the AI's product recommendations to the user. The "why" behind a recommendation is just as important as the recommendation itself.

What We're Looking For:
- UI/UX & Creativity: How do you make this a polished and intuitive experience?
- Code Quality & Architecture: How do you structure your React Native application?
- API & State Management: How do you handle asynchronous calls and manage the application's state?

Development Environment: Please build your application using snack.expo.dev.
AI Usage: We encourage you to use AI tools (like ChatGPT, GitHub Copilot, etc.) to assist you in building your solution.

Documentation: Your submission must include a README.md file that details:
- Architecture: A high-level overview of your component structure and data flow.
- Approach: Key design decisions you made and why.
- File Structure: An explanation of your project's file organization.
```

## 🔧 Technical Implementation Requests

### 1. Project Setup and Structure

```
"so project setup is done i am using current one from 2nd step start work"
```

### 2. AI Integration Request

```
"i have created @Product.ts in this all the product data is present. Now when user searches any data in any easy language it should suggest correct products. for this you need to integrate any ai searching"
```

### 3. Catalog Optimization

```
"so right now i am sending this whole catalog every time can it be optimised by some approach"
```

### 4. Scalability Concerns

```
"how you manage this suppose in future if their any product added so how it is scalable"
```

### 5. UI Focus Issues

```
"focus of textField is removed now when i touch on it it is removing every time"
```

### 6. Query Performance Optimization

```
"right now query is taking a lot of time you can implement caching to reduce this. or is it possible server could learn my catalogue for some time so that it can query easily"
```

### 7. Query Learning Implementation

```
"implement query learning only"
```

### 8. Storage Issues Resolution

```
"queryLearning.ts:341 Failed to save learning data: ReferenceError: Property 'localStorage' doesn't exist"
```

### 9. Storage Preference

```
"do not use async storage just use from the catalog json everytime"
```

### 10. Keyboard Handling

```
"i want to keep this search input inside but keyboard is not working inside flatlist"
```

### 11. Search Bar Sizing

```
"make this search bar little small in height"
```

### 12. Button Placement

```
"keep this getRecommendation button in side of text bar"
```

### 13. HTTP Client Change

```
"use axios"
```

### 14. Performance Concerns

```
"i think this is not actually working if it is why i need to send big product list to ai model"
```

### 15. Business Logic Separation

```
"keep the buisiness logic in useAdvisory.tsx so that it will be clear"
```

### 16. Smart Filter Configuration

```
"also this smart filter keep this as flag based so that it can be switched on or off"
```

### 17. Smart Filter Simplification

```
"i mean this whole feature of smartFilter should be flag based so if it is false i will send full product list to ai else i will filter"
```

### 18. Summary Text Management

```
"keep this in 3-4 lines rest their should be a readmore button to enalble more text"
```

### 19. Function-Based Approach

```
"why are you using class use function instead"
```

### 20. Function-Based Logger

```
"use only function not class"
```

### 21. Logger API Preference

```
"keep like that i can use logger.log or logger .debug something like that"
```

### 22. Production Logging Control

```
"on every function their should be a flag to print log in production or not"
```

### 23. Project-Wide Logger Implementation

```
"change the logs in whole project using custom logger"
```

### 24. Read More Button Positioning

```
"keep this in row"
```

### 25. Inline Read More Button

```
"keep ReadMore button just next to end text"
```

## 📚 Documentation Requests

### 26. Final Documentation

```
"now for whole context update the Readme file also create a prompt.md file for all important prompt that i had given from begining"
```
