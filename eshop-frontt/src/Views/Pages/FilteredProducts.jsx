import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaSort } from "react-icons/fa";
import { useCurrency } from "../../contexts/CurrencyContext";
import "../../Styles/FilterProducts.css";

const API = "https://localhost:5050";

const FilteredProducts = () => {
  const { filterType, filterId } = useParams();
  const [products, setProducts] = useState([]);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const PAGE_SIZE = 8;
  const [totalCount, setTotalCount] = useState(0);

  const { convert, format } = useCurrency();

  const fetchProducts = async () => {
    if (!filterType || !filterId) return;

    const params = new URLSearchParams({
      PageIndex: pageIndex,
      PageSize: PAGE_SIZE,
    });

    let url = "";

    switch (filterType) {
      case "category":
        url = `${API}/products/by-category/${filterId}?${params}`;
        break;
      case "brand":
        url = `${API}/products/by-brand/${filterId}?${params}`;
        break;
      case "subcategory":
        url = `${API}/products/by-subcategory/${filterId}?${params}`;
        break;
      default:
        setProducts([]);
        setTotalCount(0);
        return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      // Backend for subcategory returns a List<ProductDTO>, not paged
      const isPaged = data?.items !== undefined;

      setProducts(isPaged ? data.items : data);
      setTotalCount(isPaged ? data.totalCount : data.length);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotalCount(0);
    }
  };

  useEffect(() => {
    setPageIndex(0); // Reset to page 1 when filter changes
  }, [filterType, filterId]);

  useEffect(() => {
    fetchProducts();
  }, [filterType, filterId, pageIndex]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low") return a.price - b.price;
    if (sortOrder === "high") return b.price - a.price;
    if (sortOrder === "az") return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <section className="product-section">
      <div className="sort-button-container">
        <button
          className="sort-button"
          onClick={() => setShowSortOptions(!showSortOptions)}
          aria-haspopup="true"
          aria-expanded={showSortOptions}
        >
          <FaSort style={{ marginRight: "6px" }} />
          Sort
        </button>

        {showSortOptions && (
          <div className="sort-options" role="menu">
            <button onClick={() => { setSortOrder("low"); setShowSortOptions(false); }}>Price: Low to High</button>
            <button onClick={() => { setSortOrder("high"); setShowSortOptions(false); }}>Price: High to Low</button>
            <button onClick={() => { setSortOrder("az"); setShowSortOptions(false); }}>Products: A-Z</button>
          </div>
        )}
      </div>

      <div className="product-list">
        {sortedProducts.length > 0 ? (
          <>
            <div className="product-grid">
              {sortedProducts.map((product) => {
                const imgSrc = product.imageUrl
                  ? product.imageUrl.startsWith("http")
                    ? product.imageUrl
                    : `${API}${product.imageUrl}`
                  : "/Assets/placeholder.png";

                return (
                  <div key={product.id} className="product-card">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-info">
                      <p className="product-price">{format(convert(product.price))}</p>
                      <Link to={`/products/${product.id}`} className="details">Details</Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pagination">
              <div className="pagination-buttons-grid">
                <button
                  onClick={() => setPageIndex((i) => Math.max(i - 1, 0))}
                  disabled={pageIndex === 0}
                  aria-label="Previous page"
                >
                  ← Prev
                </button>

                <div className="pagination-info">
                  Page {pageIndex + 1} of {totalPages || 1}
                </div>

                <button
                  onClick={() => setPageIndex((i) => Math.min(i + 1, totalPages - 1))}
                  disabled={pageIndex + 1 >= totalPages}
                  aria-label="Next page"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>No products found</p>
        )}
      </div>
    </section>
  );
};

export default FilteredProducts;
