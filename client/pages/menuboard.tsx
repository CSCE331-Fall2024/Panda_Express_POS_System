import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';


const menuboard: React.FC = () => {
    const categories = ['Combos', 'Appetizers', 'Entrees', 'Sides', 'Drinks'];
    const menuItems = {
        Combos: [
            {name: "A La Carte", price: '$3', image: 'https://olo-images-live.imgix.net/27/272ad84a8af2494ba7cb2eecbe0c2b7e.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=fb32dcae532d307a7bbc5d7cfd83278a', description: 'Individual entrees & sides'},
            {name: "Bowl", price: '$7', image: 'https://olo-images-live.imgix.net/72/7288570f72a54140a41afdcfbd0e8980.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=5c543defe38946e36a8694d0b149fda4', description: '1 side & 1 entree.'},
            {name: "Plate", price: '$10', image: 'https://olo-images-live.imgix.net/dd/dd91fc53f7124f86ae7833eede4a802f.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=b08d9fd5cc269c84f2b223298752819d', description: '1 side & 2 entree.'},
            {name: "Bigger Plate", price: '$13', image: 'https://olo-images-live.imgix.net/39/39cf53c131764ddbb70efaedaaf60201.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=c60acecc206a1ae26f7ce8c6cef07399', description: '1 side & 3 entree.'},
        ],
        Sides: [
            {name: "White Rice", price: '$7', image: 'https://nomnom-files.pandaexpress.com/global/assets/modifiers/Sides_WhiteSteamedRice.png', description: '1 side & 1 entree.'}, 
            {name: "Brown Rice", price: '$7', image: 'https://www.pandaexpress.kr/sites/jp/files/how-to-panda/product-2-3.jpg', description: '1 side & 1 entree.'}, 
            {name: "Chow Mein", price: '$7', image: 'https://nomnom-files.pandaexpress.com/global/assets/modifiers/Sides_ChowMein.png', description: '1 side & 1 entree.'}, 
            {name: "Super Greens", price: '$7', image: 'https://nomnom-files.pandaexpress.com/global/assets/modifiers/Vegetables_SuperGreens.png', description: '1 side & 1 entree.'}, 
            {name: "Fried Rice", price: '$7', image: 'https://nomnom-files.pandaexpress.com/global/assets/modifiers/Sides_FriedRice.png', description: '1 side & 1 entree.'}, 

            // "Brown Rice", "Chow Mein", "Fried Rice", "Super Greens"
        ],
        Entrees: [
                { name: "Orange Chicken", price: "$3.50", image: "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Chicken_OrangeChicken.png", description: "Crispy chicken in tangy orange sauce." },
                { name: "Beijing Beef", price: "$3.50", image: "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Beef_BeijingBeef.png", description: "Savory beef with peppers and onions." },
                { name: "Mushroom Chicken", price: "$3.50", image: "https://olo-images-live.imgix.net/8b/8b254283b24a4643949f9dc649a5bbca.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=5c71dcc68a77256b11d3628316d777cd", description: "Tender chicken with mushrooms and zucchini." },
                { name: "Teriyaki Chicken", price: "$3.50", image: "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Chicken_GrilledTeriyakiChicken.png", description: "Grilled chicken with teriyaki sauce." },
                { name: "Kung Pao Chicken", price: "$3.50", image: "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Chicken_KungPaoChicken.png", description: "Spicy chicken with peanuts and vegetables." },
                { name: "Black Pepper Chicken", price: "$3.50", image: "https://olo-images-live.imgix.net/53/53efafba80ed4363b8a3a632a4806565.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=8807d429304c6d38fb8c40203de6e3cd", description: "Chicken with black pepper and celery." },
                { name: "Firecracker Shrimp", price: "$3.50", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbuO4WDiqaVBQWvxzs5iCaoPQiaoBzpjkYzw&s", description: "Spicy shrimp with bell peppers." },
                { name: "Honey Walnut Shrimp", price: "$3.50", image: "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Seafood_HoneyWalnutShrimp.png", description: "Crispy shrimp with honey sauce and walnuts." },
                { name: "Broccoli Beef", price: "$3.50", image: "https://nomnom-files.pandaexpress.com/global/assets/modifiers/Beef_BroccoliBeef.png", description: "Beef with broccoli in savory sauce." },
          ],
        Appetizers: [
            {name: "Cream Cheese Rangoon", price: '$2', image: 'https://olo-images-live.imgix.net/fe/fef7db209d7d41e6ae065af16afa1577.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=f14d518edf4e7ee0fd22b4d3cddc59b8', description: '3 Cream Cheese Rangoons.'}, 
            {name: "Chicken Egg Roll", price: '$2', image: 'https://olo-images-live.imgix.net/52/524bbb9023e2409b8d3fceae944a808f.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=4f4cc30df356786bbe3968181f8c5160', description: '2 Chicken Egg Rolls.'},
            {name: "Veggie Spring Roll", price: '$2', image: 'https://olo-images-live.imgix.net/18/183834b8a35a4737a73a28421f68b4f0.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=810&h=540&fit=crop&fm=png32&s=0d4be7c417ec1998251da41d5bfe13fb', description: '2 Veggie Spring Rolls.'} 

          ],
        Drinks: [
            {name: "Fountain Drink", price: '$2.50', image: 'https://olo-images-live.imgix.net/05/0543dea3f26343c197194e1102d44d25.png?auto=format%2Ccompress&q=60&cs=tinysrgb&w=716&h=474&fit=crop&fm=png32&s=875daff9982b3bafd3f9d890f31f50cb', description: '1 fountain drink.'} 
        ],
      }
      const [selectedCategory, setSelectedCategory] = useState('Combos');

    return (
      <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundImage: 'url(https://images.firstwefeast.com/complex/image/upload/c_fill,dpr_auto,f_auto,fl_lossy,g_face,q_auto,w_1280/folmh1obxcvowjpgk1kr.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden'
        }}
        >
        {/* Dim Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // 50% black overlay to dim background
      }}></div>

      {/* Full-Width Navbar */}
      <nav
        style={{
          backgroundColor: '#FF0000',
          color: '#FFFFFF',
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'absolute',
          top: 0,
          zIndex: 1
        }}
      >
        {/* Panda Express Logo aligned to the left */}
        <img
          src="https://s3.amazonaws.com/PandaExpressWebsite/Responsive/img/home/logo.png"
          alt="Panda Express Logo"
          style={{ width: '80px' }}
        />

        {/* Sign In Text */}
        <a href="/" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)', }}>
          <span style={{ fontWeight: 'bold' }}>Sign In</span>
        </a>

        {/* Order Now Icon aligned to the right [TODO]:CHANGE HREF TO CUSTOMER */}
        <a href="/customer" style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ShoppingBag size={20} style={{ marginRight: '5px' }} />
          <span style={{ fontWeight: 'bold' }}>Order Now</span>
        </a>
      </nav>
      {/* menu viewing options - Spans Full Screen Width */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          marginTop: '60px',
          width: '100%',
          maxWidth: '80%',
          height: '100%',
          maxHeight: '75%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight white background for readability
          borderRadius: '8px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <h1 style ={{marginBottom:'10px', fontSize: '18px', fontWeight: 'bold'}}> Choose Your Meal Type</h1>
        <div
            style = {{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px'
            }}
        > 
        {categories.map(category=> (
            <button
                key = {category}
                onClick = {() => setSelectedCategory(category)}
                style={{
                    padding: '10px 15px',
                    backgroundColor: selectedCategory === category ? '#FF0000' : '#FFFFFF',
                    color: selectedCategory === category ? '#FFFFFF' : '#000000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                >
                    {category}
                </button>
                ))}
        </div>
        <div 
            style={{
                display: 'flex',
                overflow: 'auto',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center'
            }}
        >
            {menuItems[selectedCategory].map(item => (
                <div key={item.name} 
                    style = {{
                        width: '200px',
                        padding: '10px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }} 
                >
                <img src = {item.image} alt = {item.name} 
                    style = {{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px'
                        }}/>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '10px 0' }}>
                        {item.name}
                        </h3>
                <p style={{ fontSize: '14px', color: '#555' }}>
                        {item.description}
                        </p>
                <span style={{ fontWeight: 'bold', marginTop: '5px' }}>
                    {item.price}</span>
                </div>
            ))}
            </div>
        </div>
      </div>
    );
  };
  
  export default menuboard;