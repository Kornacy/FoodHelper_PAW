import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getFridgeItems, getAllProducts, addToFridge, removeFromFridge, updateQuantity, createNewProduct } from '../services/fridgeService';
import './Fridge.css';

const Fridge = () => {
    const [fridgeItems, setFridgeItems] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addToFridgeAfterCreate, setAddToFridgeAfterCreate] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newProductData, setNewProductData] = useState({
        name: '',
        unit: 'l',
        calories: '',
    });

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


    // Obsługa dodawania (z listy wszystkich produktów)
    const handleAdd = async (product) => {
        try {
            await addToFridge(product.id);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Nie udało się dodać produktu.");
        }
    };

    // Obsługa usuwania (całkowitego)
    const handleDelete = async (prodId) => {
        console.log(`Usuwany product z id ${prodId}`)
        //if (!window.confirm("Czy na pewno usunąć ten produkt?")) return;
        try {
            await removeFromFridge(prodId);
            setFridgeItems(prev => prev.filter(item => item.id !== prodId));

        } catch (error) {
            console.error("Błąd usuwania:", error);
            alert("Nie udało się usunąć produktu");
        }
    };

    // Zmiana ilości (+/-)
    const handleUpdateQty = async (item, change) => {
        const currentQty = item.quantity;
        const newQty = currentQty + change;

        if (newQty <= 0) {

            handleDelete(item.id);
            return;
        }

        try {
            await updateQuantity(item.id, newQty);


            setFridgeItems(prev => prev.map(p =>
                p.id === item.id
                    ? { ...p, quantity: newQty }
                    : p
            ));
        } catch (error) {
            console.error(error);
            alert("Nie udało się zmienić ilości.");
        }
    };
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        console.log(newProductData.name, newProductData.calories, newProductData.unit)
        if (!newProductData.name || !newProductData.calories || !newProductData.unit) {
            alert("Wypełnij nazwę jednostkę i kalorie!");
            return;
        }
        try {
            const createdProduct = await createNewProduct(newProductData);
            if (addToFridgeAfterCreate) {
                if (createdProduct && createdProduct.id) {
                    await addToFridge(createdProduct.id);
                }
            }
            setNewProductData({ name: '', calories: '' });
            setShowCreateForm(false);
            alert("Produkt utworzony pomyślnie!");
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Błąd tworzenia produktu.");
        }
    };
    if (loading) return <div className="fridge-container">Ładowanie lodówki</div>;
    const fridgeProductIds = fridgeItems.map(item => item.id);
    const availableProducts = allProducts.filter(product => !fridgeProductIds.includes(product.id));
    return (
        <div className="fridge-container">
            <Link to="/start">← Wróć do panelu</Link>
            <h1>Zarządzanie Lodówką 🧊</h1>
            <button
                className="add-btn"
                style={{ backgroundColor: '#3498db' }}
                onClick={() => setShowCreateForm(!showCreateForm)}
            >
                {showCreateForm ? 'Anuluj dodawanie' : '+ Stwórz nowy produkt'}
            </button>
            {showCreateForm && (
                <div className="create-product-form" style={{
                    background: '#382c2c', padding: '20px', borderRadius: '8px',
                    marginBottom: '20px', border: '2px solid #3498db',
                    display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'end'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Nazwa produktu:</label>
                        <input
                            type="text"
                            placeholder="np. Banan"
                            value={newProductData.name}
                            onChange={e => setNewProductData({ ...newProductData, name: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Kalorie (kcal):</label>
                        <input
                            type="number"
                            placeholder="np. 89"
                            value={newProductData.calories}
                            onChange={e => setNewProductData({ ...newProductData, calories: e.target.value })}
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Jednostka:</label>
                        <select
                            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            value={newProductData.unit}
                            defaultValue={"l"}
                            on={e => setNewProductData({ ...newProductData, unit: e.target.value })}
                            onChange={e => setNewProductData({ ...newProductData, unit: e.target.value })}
                        >
                            {/* <option value={'szt'}>sztuka</option> [TODO]:Odkomentować */}
                            <option value={'l'}>litr</option>
                            <option value={'ml'}>mililitr</option>
                            <option value={'kg'}>kilogram</option>
                            <option value={'mg'}>miligram</option>
                        </select>
                    </div>
                    <button
                        onClick={handleCreateProduct}
                        className="add-btn"
                        style={{ height: '40px' }}
                    >
                        Zapisz w bazie
                    </button>
                    <div style={{ width: '100%', marginTop: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <input
                                type="checkbox"
                                checked={addToFridgeAfterCreate}
                                onChange={(e) => setAddToFridgeAfterCreate(e.target.checked)}
                                style={{ marginRight: '8px', width: 'auto' }}
                            />
                            Dodaj automatycznie do lodówki po utworzeniu
                        </label>
                    </div>
                </div>
            )}
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
                        {availableProducts.length === 0 ? (
                            <p>Wszystkie produkty są już w lodówce!</p>
                        ) : (
                            availableProducts.map(product => (
                                <div key={product.id} className="item-card" style={{ background: '#f9f9f9' }}>
                                    <div className="item-info">
                                        <h3>{product.name}</h3>
                                        <p>{product.calories} kcal</p>
                                    </div>
                                    <button className="add-btn" onClick={() => handleAdd(product)}>
                                        + Do lodówki
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Fridge;