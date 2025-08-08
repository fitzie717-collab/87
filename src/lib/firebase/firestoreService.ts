
'use client';

import { db } from './client';
import { collection, addDoc, getDocs, serverTimestamp, Timestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { AssetAnalysisOutput } from '@/ai';

export interface BrandSafetyData {
  isSafe: boolean;
  flags: string[];
  reasoning: string;
}

export type AssetStatus = 'New' | 'In Review' | 'Approved' | 'Rejected' | 'Ready for Publisher' | 'Picked Up';
export type AssetContentType = 'Branded' | 'Endorsed' | 'UGC' | 'Mixed' | 'N/A';

export interface Asset extends Partial<AssetAnalysisOutput> {
  id?: string;
  creator: string;
  type: 'Video' | 'Image' | 'Blog Post' | 'Audio' | string;
  length: string;
  campaign: string;
  tags: string;
  creationDate: string; 
  contentSnId: string;
  daypart: string;
  spotLength: string;
  parentCompany?: string;
  brand?: string;
  product?: string;
  brandSafety?: BrandSafetyData;
  status?: AssetStatus;
  contentType?: AssetContentType;
  thumbnail?: string;
  name?: string;
  contentScore?: number;
  roas?: number;
  spend?: number;
  cpa?: number;
}

const generateContentSnId = (type: string, creator: string, campaign: string, date: Date): string => {
  const typeCode = type.substring(0, 3).toUpperCase();
  const creatorCode = creator.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const campaignCode = campaign.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const dateCode = date.toISOString().split('T')[0].replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${typeCode}-${creatorCode}-${campaignCode}-${dateCode}-${randomSuffix}`;
};

export const addAsset = async (assetData: Omit<Asset, 'creationDate' | 'contentSnId' | 'id'>): Promise<Asset> => {
  const creationDate = new Date();
  const contentSnId = generateContentSnId(assetData.type, assetData.creator, assetData.campaign, creationDate);
  const id = uuidv4();
  
  const docRef = await addDoc(collection(db, 'assets'), {
    ...assetData,
    id,
    contentSnId,
    creationDate: Timestamp.fromDate(creationDate),
  });

  return {
    id: docRef.id,
    ...assetData,
    contentSnId,
    creationDate: creationDate.toISOString().split('T')[0],
  };
};

export const getAssets = async (): Promise<Asset[]> => {
  const querySnapshot = await getDocs(collection(db, "assets"));
  const assets: Asset[] = [];
  querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data();
    assets.push({
      id: doc.id,
      creator: data.creator,
      type: data.type,
      length: data.length,
      campaign: data.campaign,
      tags: data.tags,
      contentSnId: data.contentSnId,
      creationDate: (data.creationDate as Timestamp).toDate().toISOString().split('T')[0],
      daypart: data.daypart || 'N/A',
      spotLength: data.spotLength || 'N/A',
      parentCompany: data.parentCompany,
      brand: data.brand,
      product: data.product,
      brandSafety: data.brandSafety,
      analysis: data.analysis,
      mlReadyFeatures: data.mlReadyFeatures,
      status: data.status,
      contentType: data.contentType,
      thumbnail: data.thumbnail,
      name: data.name,
      contentScore: data.contentScore,
    });
  });
  return assets;
};
