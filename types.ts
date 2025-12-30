import React from 'react';

export enum ViewState {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE',
  CHAT = 'CHAT',
  SCRIPTS = 'SCRIPTS',
  REFERRALS = 'REFERRALS',
  ADMIN_PANEL = 'ADMIN_PANEL'
}

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  HELPER = 'HELPER',
  MODER = 'MODER',
  LOGER = 'LOGER',
  DEVELOPER = 'DEVELOPER',
  VERIFIED = 'Проверенный',
  WASTED = 'Потрачено',
  PLUS_REP = '+REP',
  SCAM = 'SCAM',
  MINUS_REP = '-REP',
  USER = 'Пользователь'
}

export interface Promocode {
  id: string;
  code: string;
  days: number;
  createdBy: string;
  createdAt: string;
  maxActivations: number;
  currentActivations: number;
}

export interface Message {
  id: number;
  senderId: number | string;
  recipientId?: number | string; 
  username: string;
  roles: UserRole[];
  text: string;
  image?: string; 
  timestamp: number;
  isSystem?: boolean;
}

export interface Report {
  id: string;
  reporterId: string | number;
  reportedId: string | number;
  reason: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'resolved';
}

export interface User {
  id: number | string;
  username: string;
  password?: string;
  telegramId?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  roles: UserRole[]; 
  
  isMuted?: boolean;
  muteUntil?: number; 
  isInfoLocked?: boolean;
  lockInfoUntil?: number;
  isPhotoLocked?: boolean;
  lockPhotoUntil?: number;

  referralCode: string;
  invitedBy?: string;
  referralCount: number;
  subscriptionDays: number;

  blockedUserIds?: (string | number)[];
  activeContactIds?: (string | number)[];
}

export interface AppSettings {
  enableSnow: boolean;
  enableMouseTrail: boolean;
  dashboardBg: string;
}