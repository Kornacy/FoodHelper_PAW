import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getFridgeItems, getAllProducts, addToFridge, removeFromFridge, updateQuantity } from '../services/fridgeService';
import './Fridge.css';

const Fridge = () => {
    const [fridgeItems, setFridgeItems] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const [fridgeData, productsData] = await Promise.all([
                getFridgeItems(),
                getAllProducts()
            ]);
            setFridgeItems(fridgeData);
            setAllProducts(productsData);
            setLoading(false);
        } catch (error) {
            console.error("Błąd pobierania danych:", error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    

    // Obsługa dodawania (+1 w lodówce)
    const handleAdd = async (product) => {
        try {
            await addToFridge(product.id);
            fetchData(); 
        } catch (error) {
            alert(error,"Nie udało się dodać produktu.");
        }
    };

    // Obsługa usuwania (całkowitego)
    const handleDelete = async (itemId) => {
        if(!window.confirm("Czy na pewno usunąć ten produkt?")) return;
        try {
            await removeFromFridge(itemId);
            fetchData(); 
        } catch (error) {
            console.error(error);
        }
    };

    // Zmiana ilości (+/-)
    const handleUpdateQty = async (item, change) => {
        const newQty = item.FridgeItem.quantity + change;
        if (newQty <= 0) {
            handleDelete(item.id); 
            return;
        }
        try {
            await updateQuantity(item.id, newQty);

            setFridgeItems(prev => prev.map(p => 
                p.id === item.id 
                ? { ...p, FridgeItem: { ...p.FridgeItem, quantity: newQty } } 
                : p
            ));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="fridge-container">Ładowanie lodówki... 🧊</div>;
    return (
        <div className="fridge-container">
            <Link to="/start">← Wróć do panelu</Link>
            <h1>Zarządzanie Lodówką 🧊</h1>

            <div className="fridge-layout">
                

                <div className="fridge-section">
                    <h2 className="section-title">Twoje Zapasy ({fridgeItems.length})</h2>
                    {fridgeItems.length === 0 ? (
                        <p>Lodówka jest pusta. Dodaj coś z listy obok! 👉</p>
                    ) : (
                        fridgeItems.map(item => (
                            <div key={item.id} className="item-card">
                                <div className="item-info">
                                    <h3>{item.name}</h3>
                                    <p>{item.calories} kcal / szt</p>
                                </div>
                                <div className="item-actions">
                                    <button className="qty-btn" onClick={() => handleUpdateQty(item, -1)}>-</button>
                                    <span>{item.quantity} szt.</span>
                                    <button className="qty-btn" onClick={() => handleUpdateQty(item, 1)}>+</button>
                                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>Usuń</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>


                <div className="products-section">
                    <h2 className="section-title">Dodaj produkty</h2>
                    <div className="products-list">
                        {allProducts.map(product => (
                            <div key={product.id} className="item-card" style={{ background: '#f9f9f9' }}>
                                <div className="item-info">
                                    <h3>{product.name}</h3>
                                    <p>{product.calories} kcal</p>
                                </div>
                                <button className="add-btn" onClick={() => handleAdd(product)}>
                                    + Do lodówki
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Fridge;