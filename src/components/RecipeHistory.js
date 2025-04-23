import React from 'react';

const RecipeHistory = ({ recipes }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Recipe History</h2>
      
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="border rounded-lg p-4">
            <div className="mb-2">
              <span className="text-sm text-gray-500">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Ingredients: </span>
              {recipe.items.join(', ')}
            </div>
            <div className="whitespace-pre-wrap">{recipe.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeHistory; 