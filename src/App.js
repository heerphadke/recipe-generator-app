import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { generateRecipe } from './services/gemini';
import './App.css';

function App() {
  const [items, setItems] = useState([
    'Chicken', 'Rice', 'Tomatoes', 'Onions', 'Garlic', 'Bell Peppers',
    'Olive Oil', 'Pasta', 'Eggs', 'Milk', 'Cheese', 'Butter'
  ]);
  const [basketItems, setBasketItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      title: "Pasta with Garlic & Cheese Dish",
      content: `Ingredients:
• Pasta - to taste
• Garlic - fresh
• Cheese - fresh
• Onions - fresh

Instructions:
1. Prepare all the ingredients. Wash and cut as needed.
2. Heat a pan over medium heat with a tablespoon of oil.
3. Add Pasta and cook for 5 minutes.
4. Add Garlic, Cheese, Onions and continue cooking for 10 minutes.
5. Season with salt and pepper to taste.
6. Serve hot and enjoy your meal!`,
      timestamp: "Apr 23, 04:03 PM"
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const handleAddNewItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleAddToBasket = (item) => {
    if (!basketItems.includes(item)) {
      setBasketItems([...basketItems, item]);
    }
  };

  const handleRemoveFromBasket = (item) => {
    setBasketItems(basketItems.filter(i => i !== item));
  };

  const handleGenerateRecipe = async () => {
    if (basketItems.length === 0) {
      toast.error('Please add items to your basket first!');
      return;
    }

    setIsGenerating(true);

    try {
      console.log('Starting recipe generation with items:', basketItems);
      const generatedRecipe = await generateRecipe(basketItems);
      console.log('Generated recipe:', generatedRecipe);
      if (!generatedRecipe) {
        throw new Error('No recipe was generated');
      }
      
      const newRecipe = {
        id: Date.now(),
        title: generatedRecipe.split('\n')[0],
        content: generatedRecipe.split('\n').slice(1).join('\n'),
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      
      setRecipes([newRecipe, ...recipes]);
      setExpandedRecipe(newRecipe.id);
      toast.success('Recipe generated successfully!');
    } catch (error) {
      console.error('Detailed error in handleGenerateRecipe:', error);
      let errorMessage = 'Failed to generate recipe. ';
      if (error.message.includes('API key')) {
        errorMessage += 'API key is missing or invalid. Please check your configuration.';
      } else if (error.message.includes('404')) {
        errorMessage += 'API endpoint not found. Please check your configuration.';
      } else {
        errorMessage += 'Please try again.';
      }
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleRecipe = (recipeId) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-[32px] font-semibold flex items-center justify-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M26.667 10.667h-2.667V8c0-1.467-1.2-2.667-2.667-2.667H8C6.533 5.333 5.333 6.533 5.333 8v2.667H2.667C1.2 10.667 0 11.867 0 13.333v10.667C0 25.467 1.2 26.667 2.667 26.667H26.667c1.467 0 2.667-1.2 2.667-2.667V13.333c0-1.466-1.2-2.666-2.667-2.666zM8 8h13.333v2.667H8V8zm18.667 16H2.667V13.333h24v10.667z" fill="#6552FF"/>
            </svg>
            Reference UI - <span className="text-[#6552FF]">sRecipe</span> Generator
          </h1>
        </div>

        <div className="mb-12">
          <h2 className="text-[28px] font-semibold mb-6">Your Pantry</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add new item..."
              className="flex-1 p-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6552FF]"
            />
            <button
              onClick={handleAddNewItem}
              className="bg-[#6552FF] text-white px-4 rounded-lg hover:bg-primary-dark text-xl font-medium"
            >
              +
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.167 15.833c3.682 0 6.666-2.984 6.666-6.666 0-3.682-2.984-6.667-6.666-6.667-3.683 0-6.667 2.985-6.667 6.667 0 3.682 2.984 6.666 6.667 6.666zM17.5 17.5l-3.625-3.625" stroke="#9CA3AF" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items..."
              className="w-full p-3 pl-10 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6552FF]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleAddToBasket(item)}
                className="bg-gray-50 py-4 px-5 rounded-lg cursor-pointer hover:bg-gray-100 text-[15px] font-medium"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[28px] font-semibold flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.21 9l-4.39-6.57a1 1 0 00-1.66 0L6.77 9H3a1 1 0 00-.97 1.22l2.8 11.27a1 1 0 00.97.76h12.4a1 1 0 00.97-.76l2.8-11.27A1 1 0 0021 9h-3.79zM12 17a2 2 0 110-4 2 2 0 010 4z" fill="#6552FF"/>
              </svg>
              Your Basket
            </h2>
            <span className="bg-[#6552FF] text-white px-3 py-1 rounded-full text-sm font-medium">
              {basketItems.length} items
            </span>
          </div>

          {basketItems.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-base">
              Your basket is empty. Add items from your pantry!
            </div>
          ) : (
            <div className="space-y-2">
              {basketItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 py-3 px-4 rounded-lg"
                >
                  <span className="text-[15px] font-medium">{item}</span>
                  <button
                    onClick={() => handleRemoveFromBasket(item)}
                    className="text-red-500 hover:text-red-600 text-xl font-medium"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleGenerateRecipe}
            disabled={isGenerating || basketItems.length === 0}
            className={`w-full mt-6 py-4 rounded-lg text-white text-base font-medium ${
              basketItems.length === 0
                ? 'bg-[#6552FF]/50 cursor-not-allowed'
                : 'bg-[#6552FF] hover:bg-primary-dark'
            }`}
          >
            {isGenerating ? 'Generating Recipe...' : 'Generate Recipe'}
          </button>
        </div>

        {recipes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-[28px] font-semibold flex items-center gap-3 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z" fill="#6552FF"/>
              </svg>
              Recipe History
            </h2>
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleRecipe(recipe.id)}
                  >
                    <h3 className="text-xl font-semibold">{recipe.title}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 text-sm font-medium">{recipe.timestamp}</span>
                      <svg
                        className={`w-6 h-6 transform transition-transform ${
                          expandedRecipe === recipe.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {expandedRecipe === recipe.id && (
                    <div className="px-4 pb-4">
                      <div className="whitespace-pre-wrap font-[Poppins] text-gray-700 text-base">
                        {recipe.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
