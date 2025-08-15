"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/');
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  return { isAuthenticated, isLoading };
}

export function useAuthWithRole(allowedRoles = []) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      router.push('/');
      return;
    }
    
    setIsAuthenticated(true);
    
    if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
      setHasAccess(true);
    } else {
      setHasAccess(false);
    }
    
    setIsLoading(false);
  }, [router, allowedRoles]);

  return { isAuthenticated, hasAccess, isLoading };
}