import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getFridgeItems, getAllProducts, addToFridge, removeFromFridge, updateQuantity, createNewProduct } from '../services/fridgeService';
import './Fridge.css';

const ITEMS_PER_PAGE = 20;

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

    const [fridgePage, setFridgePage] = useState(1);
    const [productsPage, setProductsPage] = useState(1);

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

    useEffect(() => {
        setProductsPage(1);
    }, [allProducts.length]);

    useEffect(() => {
        setFridgePage(1);
    }, [fridgeItems.length]);

    const handleAdd = async (product) => {
        try {
            await addToFridge(product.id);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Nie udało się dodać produktu.");
        }
    };

    const handleDelete = async (prodId) => {
        console.log(`Usuwany product z id ${prodId}`)
        try {
            await removeFromFridge(prodId);
            setFridgeItems(prev => prev.filter(item => item.id !== prodId));
        } catch (error) {
            console.error("Błąd usuwania:", error);
            alert("Nie udało się usunąć produktu");
        }
    };

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

    const fridgeProductIds = fridgeItems.map(item => item.id);
    const availableProducts = allProducts.filter(product => !fridgeProductIds.includes(product.id));

    const indexOfLastFridgeItem = fridgePage * ITEMS_PER_PAGE;
    const indexOfFirstFridgeItem = indexOfLastFridgeItem - ITEMS_PER_PAGE;
    const currentFridgeItems = fridgeItems.slice(indexOfFirstFridgeItem, indexOfLastFridgeItem);
    const totalFridgePages = Math.ceil(fridgeItems.length / ITEMS_PER_PAGE);

    const indexOfLastProduct = productsPage * ITEMS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - ITEMS_PER_PAGE;
    const currentProducts = availableProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalProductsPages = Math.ceil(availableProducts.length / ITEMS_PER_PAGE);

    const handleFridgePageChange = (pageNumber) => {
        setFridgePage(pageNumber);
    };

    const handleProductsPageChange = (pageNumber) => {
        setProductsPage(pageNumber);
    };

    if (loading) return <div className="fridge-container">Ładowanie lodówki...</div>;

    return (
        <div className="fridge-container">
            <Link to="/start" className="back-link-top">
                ← Wróć do panelu
            </Link>

            <header className="fridge-header">
                <h1 className="page-title">Zarządzanie Lodówką</h1>

                <button
                    className={`toggle-form-btn ${showCreateForm ? 'active' : ''}`}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Anuluj dodawanie' : 'Stwórz nowy produkt'}
                </button>
            </header>

            {showCreateForm && (
                <div className="create-product-container">
                    <div className="create-form-grid">
                        <div className="form-group">
                            <label>Nazwa produktu</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="np. Banan"
                                value={newProductData.name}
                                onChange={e => setNewProductData({ ...newProductData, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Kalorie (kcal)</label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="np. 89"
                                value={newProductData.calories}
                                onChange={e => setNewProductData({ ...newProductData, calories: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Jednostka</label>
                            <select
                                className="form-input"
                                value={newProductData.unit}
                                defaultValue={"l"}
                                onChange={e => setNewProductData({ ...newProductData, unit: e.target.value })}
                            >
                                <option value={'l'}>litr</option>
                                <option value={'ml'}>mililitr</option>
                                <option value={'kg'}>kilogram</option>
                                <option value={'mg'}>miligram</option>
                            </select>
                        </div>
                        <div className="form-group button-group">
                            <button
                                onClick={handleCreateProduct}
                                className="save-db-btn"
                            >
                                Zapisz w bazie
                            </button>
                        </div>
                    </div>

                    <div className="checkbox-wrapper">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={addToFridgeAfterCreate}
                                onChange={(e) => setAddToFridgeAfterCreate(e.target.checked)}
                            />
                            <span className="checkbox-text">Dodaj automatycznie do lodówki po utworzeniu</span>
                        </label>
                    </div>
                </div>
            )}

            <div className="fridge-layout">
                <section className="fridge-section">
                    <div className="section-header">
                        <h2 className="section-title">Twoje Zapasy <span className="count-badge">{fridgeItems.length}</span></h2>
                    </div>

                    <div className="items-list">
                        {fridgeItems.length === 0 ? (
                            <div className="empty-state-small">
                                <p>Lodówka jest pusta. Dodaj coś z listy obok!</p>
                            </div>
                        ) : (
                            currentFridgeItems.map(item => (
                                <div key={item.id} className="item-card fridge-item">
                                    <div className="item-info">
                                        <h3>{item.name}</h3>
                                        <p className="item-meta">{item.calories} kcal / {item.unit || 'szt'}</p>
                                    </div>
                                    <div className="item-actions">
                                        <div className="qty-controls">
                                            <button className="qty-btn" onClick={() => handleUpdateQty(item, -1)}>-</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button className="qty-btn" onClick={() => handleUpdateQty(item, 1)}>+</button>
                                        </div>
                                        <button className="delete-icon-btn" onClick={() => handleDelete(item.id)}>
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {totalFridgePages > 1 && (
                        <div className="pagination-controls" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                            marginTop: '20px'
                        }}>
                            <button
                                onClick={() => handleFridgePageChange(fridgePage - 1)}
                                disabled={fridgePage === 1}
                                style={{
                                    padding: '5px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    background: fridgePage === 1 ? '#eee' : 'white',
                                    cursor: fridgePage === 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Poprzednia
                            </button>
                            
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Strona {fridgePage} z {totalFridgePages}
                            </span>

                            <button
                                onClick={() => handleFridgePageChange(fridgePage + 1)}
                                disabled={fridgePage === totalFridgePages}
                                style={{
                                    padding: '5px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    background: fridgePage === totalFridgePages ? '#eee' : 'white',
                                    cursor: fridgePage === totalFridgePages ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Następna
                            </button>
                        </div>
                    )}
                </section>

                <section className="products-section">
                    <div className="section-header">
                        <h2 className="section-title">Baza Produktów ({availableProducts.length})</h2>
                    </div>

                    <div className="items-list">
                        {availableProducts.length === 0 ? (
                            <div className="empty-state-small">
                                <p>Wszystkie produkty są już w lodówce!</p>
                            </div>
                        ) : (
                            currentProducts.map(product => (
                                <div key={product.id} className="item-card product-item">
                                    <div className="item-info">
                                        <h3>{product.name}</h3>
                                        <p className="item-meta">{product.calories} kcal</p>
                                    </div>
                                    <button className="add-to-fridge-btn" onClick={() => handleAdd(product)}>
                                        + Do lodówki
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {totalProductsPages > 1 && (
                        <div className="pagination-controls" style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                            marginTop: '20px'
                        }}>
                            <button
                                onClick={() => handleProductsPageChange(productsPage - 1)}
                                disabled={productsPage === 1}
                                style={{
                                    padding: '5px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    background: productsPage === 1 ? '#eee' : 'white',
                                    cursor: productsPage === 1 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Poprzednia
                            </button>
                            
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                Strona {productsPage} z {totalProductsPages}
                            </span>

                            <button
                                onClick={() => handleProductsPageChange(productsPage + 1)}
                                disabled={productsPage === totalProductsPages}
                                style={{
                                    padding: '5px 10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '5px',
                                    background: productsPage === totalProductsPages ? '#eee' : 'white',
                                    cursor: productsPage === totalProductsPages ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Następna
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Fridge;