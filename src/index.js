import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1, input, table, thead, tr, th, tbody, td, img } = hh(h);

// Tailwind classes for styling
const btnStyleSave = "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded";
const btnStyleCancel = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
    ADD: "ADD",
    DELETE: "DELETE",
    UPDATE_MEAL: "UPDATE_MEAL",
    UPDATE_CALORIES: "UPDATE_CALORIES",
    CANCEL: "CANCEL",
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    
    // Input fields for meal and calories
    div({ className: "flex gap-4" }, [
      input({
        className: "border p-2 rounded",
        type: "text",
        placeholder: "Enter meal name...",
        value: model.meal,
        oninput: (e) => dispatch({ type: MSGS.UPDATE_MEAL, meal: e.target.value }),
      }),
      input({
        className: "border p-2 rounded",
        type: "number",
        placeholder: "Enter calories number...",
        value: model.calories,
        oninput: (e) => dispatch({ type: MSGS.UPDATE_CALORIES, calories: e.target.value }),
      }),
    ]),
    
    // Buttons for saving or canceling
    div({ className: "flex gap-4" }, [
      button({ className: btnStyleSave, onclick: () => dispatch({ type: MSGS.ADD }) }, "Save"),
      button({ className: btnStyleCancel, onclick: () => dispatch({ type: MSGS.CANCEL }) }, "Cancel"),
    ]),
    
    // Meal list table
    table({ className: "table-auto w-full" }, [
      thead([
        tr([
          th({ className: "px-4 py-2" }, "Meal"),
          th({ className: "px-4 py-2" }, "Calories"),
          th({ className: "px-4 py-2" }, ""),
        ]),
      ]),
      tbody(
        model.meals.map((meal, index) =>
          tr([
            td({ className: "border px-4 py-2" }, meal.name),
            td({ className: "border px-4 py-2" }, meal.calories),
            td({ className: "border px-4 py-2" }, [
              button(
                { onclick: () => dispatch({ type: MSGS.DELETE, index }) },
                img({ src: "trash-icon.png", alt: "Delete", className: "w-6" })
              ),
            ]),
          ])
        )
      ),
    ]),

    // Total calories display
    p({ className: "font-bold text-xl" }, `Total: ${model.totalCalories} calories`),
  ]);
}

// Update function for handling state changes
function update(msg, model) {
  switch (msg.type) {
    case MSGS.ADD:
      const newMeal = { name: model.meal, calories: Number(model.calories) };
      const updatedMeals = [...model.meals, newMeal];
      const updatedTotal = updatedMeals.reduce((sum, meal) => sum + meal.calories, 0);
      return { ...model, meals: updatedMeals, totalCalories: updatedTotal, meal: "", calories: "" };

    case MSGS.DELETE:
      const filteredMeals = model.meals.filter((_, idx) => idx !== msg.index);
      const newTotal = filteredMeals.reduce((sum, meal) => sum + meal.calories, 0);
      return { ...model, meals: filteredMeals, totalCalories: newTotal };

    case MSGS.UPDATE_MEAL:
      return { ...model, meal: msg.meal };

    case MSGS.UPDATE_CALORIES:
      return { ...model, calories: msg.calories };

    case MSGS.CANCEL:
      return { ...model, meal: "", calories: "" };

    default:
      return model;
  }
}

// Initial model
const initModel = {
  meal: "",
  calories: "",
  meals: [],
  totalCalories: 0,
};

// App function to set up rendering
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// Root node of the app
const rootNode = document.getElementById("app");
app(initModel, update, view, rootNode);
