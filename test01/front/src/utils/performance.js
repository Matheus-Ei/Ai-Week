// Performance optimization utilities for the Order Management System

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

// Debounce hook for search inputs and API calls
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook for scroll events and frequent updates
export const useThrottle = (callback, delay) => {
  const lastCall = useRef(0);
  
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
};

// Memoized data processing for large lists
export const useMemoizedProcessing = (data, processingFn, dependencies = []) => {
  return useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return processingFn(data);
  }, [data, ...dependencies]);
};

// Virtual scrolling hook for large data sets
export const useVirtualScroll = (items, containerHeight, itemHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItemsCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemsCount, items.length - 1);
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  
  return {
    visibleItems,
    totalHeight,
    offsetY: startIndex * itemHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
  };
};

// Lazy loading for images and components
export const LazyImage = ({ src, alt, className, placeholder = null }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView ? (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
        />
      ) : (
        placeholder || <div className="bg-gray-200 animate-pulse w-full h-full" />
      )}
    </div>
  );
};

// Batch API calls to reduce server load
export class APIBatcher {
  constructor(delay = 100) {
    this.delay = delay;
    this.queue = [];
    this.timeout = null;
  }

  add(apiCall) {
    return new Promise((resolve, reject) => {
      this.queue.push({ apiCall, resolve, reject });
      this.scheduleExecution();
    });
  }

  scheduleExecution() {
    if (this.timeout) return;
    
    this.timeout = setTimeout(() => {
      this.executeBatch();
      this.timeout = null;
    }, this.delay);
  }

  async executeBatch() {
    const currentQueue = [...this.queue];
    this.queue = [];

    const results = await Promise.allSettled(
      currentQueue.map(({ apiCall }) => apiCall())
    );

    results.forEach((result, index) => {
      const { resolve, reject } = currentQueue[index];
      if (result.status === 'fulfilled') {
        resolve(result.value);
      } else {
        reject(result.reason);
      }
    });
  }
}

// Cache management for API responses
export class APICache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    });
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global performance monitoring
export const performanceMonitor = {
  metrics: {
    pageLoadTime: 0,
    apiCalls: [],
    rerenders: 0,
    memoryUsage: 0,
  },

  startTiming(label) {
    performance.mark(`${label}-start`);
  },

  endTiming(label) {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    return measure.duration;
  },

  logAPICall(endpoint, duration, success) {
    this.metrics.apiCalls.push({
      endpoint,
      duration,
      success,
      timestamp: Date.now(),
    });
  },

  getReport() {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    
    return {
      pageLoad: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,      totalResources: resources.length,
      averageAPITime: this.metrics.apiCalls.reduce((sum, call) => sum + call.duration, 0) / this.metrics.apiCalls.length || 0,
      failedAPICalls: this.metrics.apiCalls.filter(call => !call.success).length,
      memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A',
    };
  },
};

// Component for monitoring render performance
export const RenderProfiler = ({ id, children, onRender }) => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (onRender) {
      onRender(id, renderCount.current);
    }
  });

  return (
    <div data-testid={`profiler-${id}`} data-render-count={renderCount.current}>
      {children}
    </div>
  );
};

// Memory leak detection
export const memoryLeakDetector = {
  trackedComponents: new Set(),
  
  track(componentName) {
    this.trackedComponents.add(componentName);
  },
  
  untrack(componentName) {
    this.trackedComponents.delete(componentName);
  },
  
  checkLeaks() {
    const leaks = [];
    this.trackedComponents.forEach(component => {
      // Check if component is still mounted but shouldn't be
      const elements = document.querySelectorAll(`[data-component="${component}"]`);
      if (elements.length > 0) {
        leaks.push(component);
      }
    });
    return leaks;
  },
};

export default {
  useDebounce,
  useThrottle,
  useMemoizedProcessing,
  useVirtualScroll,
  LazyImage,
  APIBatcher,
  APICache,
  performanceMonitor,
  RenderProfiler,
  memoryLeakDetector,
};
