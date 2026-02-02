Product Requirements Document (PRD): 2025 Trading Wrapped

# 1\. Executive Summary

"Trading Wrapped 2025" is a mobile-first, web-based retrospective that visualizes a user's trading year. Unlike a standard brokerage statement or P\&L dashboard, this product prioritizes emotional resonance ("vibes") and narrative storytelling over granular analytics.

The goal is to recreate the viral, shareable aesthetic of Spotify Wrapped, allowing users to relive their "God Mode" trades and their "Diamond Hands" moments in a format that feels native to Instagram Stories or TikTok.

# 2\. Problem Statement & Opportunity

* The Problem: Financial data is currently presented in dry, tabular spreadsheet formats that fail to capture the emotional highs and lows of a trading year.  
* The Opportunity: Traders identify deeply with their performance (wins and losses). By "gamifying" this data into a high-fidelity visual story, we create a delightful user experience that celebrates the culture of modern retail trading.  
* Transform static and numerical heavy data into visually pleasing and celebratory storytelling moment for users to recap at the end of the year

# 3\. Scope & Constraints (The "Weekend" MVP)

To ensure delivery within 48 hours, we are strictly scoping the technical complexity.

* In Scope:  
  * Hardcoded Data Layer (data.ts): No backend or API integrations.  
  * Mobile-First Viewport: Optimized for 390px width (iPhone).  
  * 5-7 Animated Slides.  
  * "Vibe" Aesthetics: Japanese anime (realism and urban city life vibe) with vibrant blues and oranges  
* Out of Scope:  
  * Real-time brokerage connections (Plaid/Yodlee).  
  * User Authentication (Login/Signup).  
  * Desktop optimization (Mobile view centered on desktop is acceptable).  
  * Historical data persistence.

# 4\. User Personas

* The "Degen" Trader: High risk tolerance, appreciates humor about losses, cares about high leverage and specific tickers (e.g., NVDA, TSLA).  
* The Casual Investor: Wants to see "how much I moved" vs. "how much I made."

# 5\. Functional Requirements (The Slides)

### Slide 1: The Hook (Intro)

* Goal: Grab attention immediately.  
* Visual: "2025 was the year of profit"  
* Data: None.  
* Visuals: Staggered text reveal \+ hustle and bustle of tokyo shibuya

### Slide 2: Total P\&L

* Goal: Show the scale of activity, regardless of profit.  
* Data Point: totalP\&L (e.g., $4.5M vs S\&P).  
* Copy: "You made a lot of money"  
* Interaction: Counter increments rapidly from 0 to totalP\&L.  
* Visuals: Show money pouring out of the 7/11 atm bank

### Slide 3: The "Carry" (TOP TRADED Asset)

* Goal: Highlight the user's "Hero" stock.  
* Data Point: topTicker object (Symbol, Profit). \+ number of trades  
* Visual: Large ticker symbol (e.g., NVDA) rotating or bouncing.  
* Copy: "You spent a lot of time with $NVDA”   
* Visuals: Room full of GPUs and servers,

### Slide 4: p\&l rank

* Goal: How you rank with everyone else  
* Data Point: ranking amongst other customers (wealth rank)  
* Visual: Animated chart showing ranking of percentile  
* Animation: Animated chart in a subway tv screen 

### Slide 5:  Time spent trading (Time)

* Goal: How much time is spent trading  
* Data Point: time spent logged in  
* Visual: Animated visual number  
* Animation: Billboards in shhibuya showing how much time user is logged in

### Slide 6: The Archetype (Finale)

* Goal: Shareable summary card.  
* Data Point: archetype (Title, Description, Roast).  
* Visual: A 3D-flippable card revealing the user's "Trading Personality" (e.g., "The Hedge fund").  
* Stats summary (year P\&L,  best ticker, \# of trades, trade volume)  
* Action: "Share" button (simulated).

# 6\. Design System & Experience Requirements

* Visual Language:  
  * Background: Deep Charcoal / Black (\#0a0a0a).  
  * Typography: *Inter* or *Geist Sans*. Headings: 800 weight (ExtraBold). Body: 500 weight.  
  * Palette:  
    * Profit: \#00FF94 (Spring Green)  
    * Loss: \#FF3366 (Neon Red)  
    * Neutral: \#888888 (Cool Grey)  
* Motion (The "Secret Sauce"):  
  * All transitions must use Spring Physics (not Linear).  
  * Lists must use Staggered Children (items appear one by one).  
  * Numbers must Count Up.

# 7\. Technical Implementation Plan

* Repository: GitHub initialized via Replit.  
* Framework: Next.js (App Router).  
* Styling: Tailwind CSS.  
* Animation Engine: framer-motion (AnimatePresence for slide transitions).  
* Data Source: Local JSON file (src/data/wrapped.ts).

# 8\. Success Metrics

* Vibe Check: Does the animation feel "bouncy" and not static?  
* Performance: Does it load under 1.5s on 4G? (Hardcoded data ensures this).  
* Completion: Can a user tap through all 6 slides without UI breaking?

