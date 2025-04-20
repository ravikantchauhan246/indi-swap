import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { SwapTokenContext } from '../../Context/SwapContext';
import Style from '../../styles/TokenDetails.module.css';
import images from '../../assets';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TokenDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const { topTokenList, fetchTokenPriceHistory } = useContext(SwapTokenContext);
  
  const [token, setToken] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('14d');
  const [additionalInfo, setAdditionalInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);

      try {
        // Find the token in our topTokenList first (if available)
        const foundToken = topTokenList.find(token => token.id === id);
        
        // If not found in our local list, fetch from API
        if (!foundToken) {
          const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
          setToken({
            id: response.data.id,
            name: response.data.name,
            symbol: response.data.symbol.toUpperCase(),
            image: response.data.image?.large,
            price: `$${response.data.market_data.current_price.usd.toLocaleString()}`,
            change: `${response.data.market_data.price_change_percentage_24h.toFixed(2)}%`,
            tvl: `$${(response.data.market_data.market_cap.usd / 1000000).toFixed(1)} M`,
            volume: `$${(response.data.market_data.total_volume.usd / 1000000).toFixed(1)} M`,
            marketCap: response.data.market_data.market_cap.usd
          });
          
          // Get additional info
          setAdditionalInfo({
            website: response.data.links?.homepage?.[0] || '',
            explorer: response.data.links?.blockchain_site?.[0] || '',
            description: response.data.description?.en,
            rank: response.data.market_cap_rank,
            high24h: response.data.market_data?.high_24h?.usd,
            low24h: response.data.market_data?.low_24h?.usd,
            circulatingSupply: response.data.market_data?.circulating_supply,
            totalSupply: response.data.market_data?.total_supply
          });
        } else {
          setToken(foundToken);
          
          // Get additional info for the token
          const detailsResponse = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
          setAdditionalInfo({
            website: detailsResponse.data.links?.homepage?.[0] || '',
            explorer: detailsResponse.data.links?.blockchain_site?.[0] || '',
            description: detailsResponse.data.description?.en,
            rank: detailsResponse.data.market_cap_rank,
            high24h: detailsResponse.data.market_data?.high_24h?.usd,
            low24h: detailsResponse.data.market_data?.low_24h?.usd,
            circulatingSupply: detailsResponse.data.market_data?.circulating_supply,
            totalSupply: detailsResponse.data.market_data?.total_supply
          });
        }
        
        // Fetch price history
        const historyData = await fetchTokenPriceHistory(id);
        setPriceHistory(historyData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching token data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, topTokenList, fetchTokenPriceHistory]);

  // Handle range change for price chart
  const handleRangeChange = async (range) => {
    setTimeRange(range);
    setLoading(true);
    
    try {
      const days = range === '24h' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 14;
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: days,
            interval: range === '24h' ? 'hourly' : 'daily'
          }
        }
      );
      
      // Process the price data
      const priceData = response.data.prices.map(item => ({
        timestamp: item[0],
        price: item[1]
      }));
      
      setPriceHistory(priceData);
    } catch (error) {
      console.error('Error fetching price history:', error);
    }
    
    setLoading(false);
  };

  const chartData = {
    labels: priceHistory.map(data => {
      const date = new Date(data.timestamp);
      return timeRange === '24h' 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Price (USD)',
        data: priceHistory.map(data => data.price),
        borderColor: '#16c784',
        backgroundColor: 'rgba(22, 199, 132, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
  };

  if (loading) {
    return (
      <div className={Style.loading}>
        <Image src={images.loading} alt="Loading..." width={100} height={100} />
        <p>Loading token data...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className={Style.error}>
        <h2>Token not found</h2>
        <button onClick={() => router.back()} className={Style.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  const priceChangeIsPositive = parseFloat(token.change) >= 0;

  return (
    <div className={Style.tokenDetails}>
      <div className={Style.tokenHeader}>
        <button onClick={() => router.back()} className={Style.backButton}>
          <Image src={images.leftarrow} alt="Back" width={20} height={20} />
          Back to Tokens
        </button>
        
        <div className={Style.tokenBasicInfo}>
          <div className={Style.tokenImage}>
            {token.image ? (
              <img src={token.image} alt={token.symbol} width={50} height={50} />
            ) : (
              <Image src={images.etherlogo} alt="Default" width={50} height={50} />
            )}
          </div>
          <div className={Style.tokenNameInfo}>
            <h1>{token.name} <span className={Style.tokenSymbol}>({token.symbol})</span></h1>
            {additionalInfo?.rank && (
              <span className={Style.tokenRank}>Rank #{additionalInfo.rank}</span>
            )}
          </div>
        </div>
      </div>
      
      <div className={Style.tokenPriceSection}>
        <div className={Style.priceHeader}>
          <h2 className={Style.currentPrice}>{token.price}</h2>
          <span className={priceChangeIsPositive ? Style.positive : Style.negative}>
            {token.change} (24h)
          </span>
        </div>
        
        <div className={Style.chartControls}>
          <button 
            className={`${Style.rangeButton} ${timeRange === '24h' ? Style.active : ''}`}
            onClick={() => handleRangeChange('24h')}
          >
            24H
          </button>
          <button 
            className={`${Style.rangeButton} ${timeRange === '7d' ? Style.active : ''}`}
            onClick={() => handleRangeChange('7d')}
          >
            7D
          </button>
          <button 
            className={`${Style.rangeButton} ${timeRange === '14d' ? Style.active : ''}`}
            onClick={() => handleRangeChange('14d')}
          >
            14D
          </button>
          <button 
            className={`${Style.rangeButton} ${timeRange === '30d' ? Style.active : ''}`}
            onClick={() => handleRangeChange('30d')}
          >
            30D
          </button>
        </div>
        
        <div className={Style.chartContainer}>
          {priceHistory.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className={Style.noData}>No price data available</p>
          )}
        </div>
      </div>
      
      <div className={Style.statsGrid}>
        <div className={Style.statCard}>
          <h3>Market Cap</h3>
          <p>${token.marketCap?.toLocaleString()}</p>
        </div>
        <div className={Style.statCard}>
          <h3>24h Trading Vol</h3>
          <p>{token.volume}</p>
        </div>
        <div className={Style.statCard}>
          <h3>24h High</h3>
          <p>${additionalInfo?.high24h?.toLocaleString()}</p>
        </div>
        <div className={Style.statCard}>
          <h3>24h Low</h3>
          <p>${additionalInfo?.low24h?.toLocaleString()}</p>
        </div>
        <div className={Style.statCard}>
          <h3>Circulating Supply</h3>
          <p>{additionalInfo?.circulatingSupply?.toLocaleString()} {token.symbol}</p>
        </div>
        <div className={Style.statCard}>
          <h3>Total Supply</h3>
          <p>{additionalInfo?.totalSupply?.toLocaleString()} {token.symbol}</p>
        </div>
      </div>
      
      {additionalInfo?.description && (
        <div className={Style.aboutSection}>
          <h2>About {token.name}</h2>
          <div 
            className={Style.description}
            dangerouslySetInnerHTML={{ __html: additionalInfo.description }}
          />
        </div>
      )}
      
      <div className={Style.links}>
        {additionalInfo?.website && (
          <a 
            href={additionalInfo.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={Style.linkButton}
          >
            Official Website
          </a>
        )}
        {additionalInfo?.explorer && (
          <a 
            href={additionalInfo.explorer} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={Style.linkButton}
          >
            Block Explorer
          </a>
        )}
        <button 
          className={Style.swapButton}
          onClick={() => router.push('/')}
        >
          Trade {token.symbol}
        </button>
      </div>
    </div>
  );
};

export default TokenDetails;