# Quick Notes App - Technical Specifications

> See also: `IMPLEMENTATION_PLAN.md` for per-feature implementation steps, testing plans, and acceptance criteria.

## System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Firebase      │    │  External APIs  │
│  (React Native) │◄──►│   Backend       │◄──►│  (OCR, etc.)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Local Storage   │    │   Firestore     │    │ Cloud Vision    │
│   (SQLite)      │    │   Auth & Cloud  │    │   OCR API       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack Details

#### Frontend (React Native)
- **Framework**: React Native 0.72+
- **Language**: TypeScript 5.0+
- **State Management**: Redux Toolkit + RTK Query
- **Navigation**: React Navigation v6
- **UI Components**: Custom design system + React Native Elements
- **Drawing**: React Native Skia
- **Local Storage**: AsyncStorage + SQLite (react-native-sqlite-storage)
- **Offline Support**: Redux Persist + Network Info

#### Backend Services
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **File Storage**: Firebase Cloud Storage
- **Cloud Functions**: Firebase Functions (Node.js)
- **Push Notifications**: Firebase Cloud Messaging

#### External APIs
- **OCR**: Google Cloud Vision API
- **Payments**: React Native IAP (Apple/Google)
- **Analytics**: Firebase Analytics + Custom Events

## Data Architecture

### Local Database Schema (SQLite)

```sql
-- Users table (for offline user data)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT,
    display_name TEXT,
    is_premium BOOLEAN DEFAULT 0,
    created_at INTEGER,
    last_sync_at INTEGER
);

-- Notes table
CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    content TEXT,
    content_type TEXT DEFAULT 'text', -- 'text', 'drawing', 'mixed'
    created_at INTEGER,
    updated_at INTEGER,
    deleted_at INTEGER,
    is_locked BOOLEAN DEFAULT 0,
    lock_password TEXT,
    auto_delete_at INTEGER,
    notebook_id TEXT,
    is_pinned BOOLEAN DEFAULT 0,
    drawing_data TEXT, -- JSON string of drawing paths
    ocr_text TEXT, -- Extracted text from images/drawings
    sync_status TEXT DEFAULT 'synced', -- 'synced', 'pending', 'conflict'
    version INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (notebook_id) REFERENCES notebooks(id)
);

-- Full-text search index for notes
CREATE VIRTUAL TABLE notes_fts USING fts5(
    note_id,
    title,
    content,
    ocr_text,
    content='notes',
    content_rowid='rowid'
);

-- Notebooks table
CREATE TABLE notebooks (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    parent_id TEXT,
    color TEXT DEFAULT '#007AFF',
    icon TEXT DEFAULT 'folder',
    created_at INTEGER,
    updated_at INTEGER,
    deleted_at INTEGER,
    sort_order INTEGER DEFAULT 0,
    sync_status TEXT DEFAULT 'synced',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES notebooks(id)
);

-- Tags table
CREATE TABLE tags (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    parent_id TEXT,
    color TEXT DEFAULT '#8E8E93',
    created_at INTEGER,
    updated_at INTEGER,
    deleted_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES tags(id)
);

-- Note-Tags junction table
CREATE TABLE note_tags (
    note_id TEXT,
    tag_id TEXT,
    created_at INTEGER,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- Media attachments
CREATE TABLE media (
    id TEXT PRIMARY KEY,
    note_id TEXT,
    file_name TEXT,
    file_path TEXT,
    file_type TEXT, -- 'image', 'audio', 'video'
    file_size INTEGER,
    mime_type TEXT,
    thumbnail_path TEXT,
    created_at INTEGER,
    sync_status TEXT DEFAULT 'synced',
    cloud_url TEXT,
    FOREIGN KEY (note_id) REFERENCES notes(id)
);

-- Sync operations queue
CREATE TABLE sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    operation_type TEXT, -- 'create', 'update', 'delete'
    table_name TEXT,
    record_id TEXT,
    data TEXT, -- JSON string of the record data
    created_at INTEGER,
    retry_count INTEGER DEFAULT 0,
    last_error TEXT
);

-- App settings
CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at INTEGER
);
```

### Cloud Database Schema (Firestore)

```javascript
// Users collection
users/{userId} {
    email: string,
    displayName: string,
    isPremium: boolean,
    subscriptionId?: string,
    subscriptionStatus?: 'active' | 'canceled' | 'expired',
    createdAt: Timestamp,
    lastActiveAt: Timestamp,
    preferences: {
        theme: 'light' | 'dark' | 'system',
        defaultNotebook?: string,
        autoSync: boolean,
        syncOnCellular: boolean
    }
}

// Notes collection (subcollection of users)
users/{userId}/notes/{noteId} {
    title: string,
    content: string,
    contentType: 'text' | 'drawing' | 'mixed',
    createdAt: Timestamp,
    updatedAt: Timestamp,
    deletedAt?: Timestamp,
    isLocked: boolean,
    notebookId?: string,
    isPinned: boolean,
    drawingData?: string, // Base64 encoded drawing data
    ocrText?: string,
    tags: string[], // Array of tag IDs
    version: number,
    mediaCount: number
}

// Notebooks collection (subcollection of users)
users/{userId}/notebooks/{notebookId} {
    name: string,
    parentId?: string,
    color: string,
    icon: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    deletedAt?: Timestamp,
    sortOrder: number,
    noteCount: number
}

// Tags collection (subcollection of users)
users/{userId}/tags/{tagId} {
    name: string,
    parentId?: string,
    color: string,
    createdAt: Timestamp,
    updatedAt: Timestamp,
    deletedAt?: Timestamp,
    noteCount: number
}

// Media collection (subcollection of notes)
users/{userId}/notes/{noteId}/media/{mediaId} {
    fileName: string,
    fileType: 'image' | 'audio' | 'video',
    fileSize: number,
    mimeType: string,
    storageUrl: string,
    thumbnailUrl?: string,
    createdAt: Timestamp
}

// Subscriptions collection
subscriptions/{subscriptionId} {
    userId: string,
    productId: string,
    status: 'active' | 'canceled' | 'expired',
    startDate: Timestamp,
    endDate: Timestamp,
    autoRenew: boolean,
    platform: 'ios' | 'android'
}
```

## API Specifications

### Local API Layer (Repository Pattern)

```typescript
// Base Repository Interface
interface Repository<T> {
    create(item: T): Promise<T>;
    findById(id: string): Promise<T | null>;
    findAll(filters?: any): Promise<T[]>;
    update(id: string, updates: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<T[]>;
}

// Notes Repository
interface NotesRepository extends Repository<Note> {
    findByNotebook(notebookId: string): Promise<Note[]>;
    findByTag(tagId: string): Promise<Note[]>;
    findPinned(): Promise<Note[]>;
    findLocked(): Promise<Note[]>;
    findWithAutoDelete(): Promise<Note[]>;
    searchFullText(query: string): Promise<Note[]>;
    searchOCR(query: string): Promise<Note[]>;
    bulkUpdate(ids: string[], updates: Partial<Note>): Promise<void>;
}

// Sync Service Interface
interface SyncService {
    syncNotes(): Promise<SyncResult>;
    syncNotebooks(): Promise<SyncResult>;
    syncTags(): Promise<SyncResult>;
    syncMedia(): Promise<SyncResult>;
    resolveConflicts(conflicts: Conflict[]): Promise<void>;
    queueOperation(operation: SyncOperation): Promise<void>;
    getQueuedOperations(): Promise<SyncOperation[]>;
}
```

### External API Integrations

#### Google Cloud Vision API
```typescript
interface OCRService {
    extractText(imageUri: string): Promise<OCRResult>;
    extractHandwriting(imageUri: string): Promise<OCRResult>;
    detectLanguage(imageUri: string): Promise<string>;
}

interface OCRResult {
    text: string;
    confidence: number;
    boundingBoxes: BoundingBox[];
    language: string;
}
```

#### In-App Purchase API
```typescript
interface SubscriptionService {
    getProducts(): Promise<Product[]>;
    purchaseProduct(productId: string): Promise<PurchaseResult>;
    restorePurchases(): Promise<Purchase[]>;
    getSubscriptionStatus(): Promise<SubscriptionStatus>;
    validateReceipt(receipt: string): Promise<boolean>;
}

interface Product {
    productId: string;
    price: string;
    currency: string;
    title: string;
    description: string;
    subscriptionPeriod: 'monthly' | 'yearly';
}
```

## Security Specifications

### Data Encryption
- **Local Data**: AES-256 encryption for sensitive note content
- **Key Management**: iOS Keychain / Android Keystore
- **Network**: TLS 1.3 for all API communications
- **File Storage**: Encrypted file system for media attachments

### Authentication & Authorization
```typescript
interface AuthService {
    signIn(email: string, password: string): Promise<User>;
    signUp(email: string, password: string): Promise<User>;
    signInWithBiometric(): Promise<User>;
    signOut(): Promise<void>;
    resetPassword(email: string): Promise<void>;
    verifyEmail(): Promise<void>;
    enableMFA(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
}

interface SecurityService {
    encryptNote(content: string): Promise<string>;
    decryptNote(encryptedContent: string): Promise<string>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
    generateSecureKey(): Promise<string>;
    secureDelete(filePath: string): Promise<void>;
}
```

### Privacy Controls
- **Data Minimization**: Collect only necessary user data
- **Consent Management**: Explicit consent for cloud sync and analytics
- **Right to Deletion**: Complete data removal on request
- **Data Portability**: Export user data in standard formats

## Performance Specifications

### App Performance Targets
- **Startup Time**: <3 seconds cold start, <1 second warm start
- **Memory Usage**: <100MB baseline, <200MB with large notes
- **Battery Usage**: <5% per hour of active use
- **Storage Efficiency**: <1MB per 1000 text notes

### Database Performance
- **Query Response**: <100ms for simple queries, <500ms for complex searches
- **Full-Text Search**: <200ms for searches across 10,000+ notes
- **Sync Performance**: <30 seconds for 1000 notes initial sync
- **Offline Performance**: 100% functionality without network

### Drawing Performance
- **Latency**: <16ms touch-to-pixel latency
- **Smoothness**: 60fps drawing performance
- **Memory**: <50MB for complex drawings
- **Export Speed**: <5 seconds for high-resolution export

## Scalability Considerations

### Local Storage Limits
- **SQLite Database**: Up to 281TB theoretical limit
- **Practical Limits**: 10,000 notes, 1GB media per user
- **Cleanup Strategy**: Automatic cleanup of deleted items after 30 days
- **Backup Strategy**: Daily local backups, cloud backup for premium

### Cloud Infrastructure
- **Firestore**: 1MB document limit, 10,000 writes/second
- **Cloud Storage**: 5TB per project, automatic CDN distribution
- **Cloud Functions**: Auto-scaling, 540 seconds timeout
- **Rate Limiting**: 1000 requests/minute per user

### Monitoring & Alerting
```typescript
interface MonitoringService {
    trackEvent(event: string, properties?: any): void;
    trackError(error: Error, context?: any): void;
    trackPerformance(metric: string, value: number): void;
    setUserProperties(properties: any): void;
    trackScreenView(screenName: string): void;
}

// Key Metrics to Monitor
const METRICS = {
    // Performance
    APP_STARTUP_TIME: 'app_startup_time',
    NOTE_SAVE_TIME: 'note_save_time',
    SEARCH_RESPONSE_TIME: 'search_response_time',
    SYNC_DURATION: 'sync_duration',
    
    // User Engagement
    NOTES_CREATED: 'notes_created',
    DRAWING_USAGE: 'drawing_usage',
    SEARCH_USAGE: 'search_usage',
    PREMIUM_CONVERSION: 'premium_conversion',
    
    // Technical
    CRASH_RATE: 'crash_rate',
    SYNC_SUCCESS_RATE: 'sync_success_rate',
    OFFLINE_USAGE: 'offline_usage',
    STORAGE_USAGE: 'storage_usage'
};
```

## Testing Specifications

### Unit Testing
- **Coverage Target**: >80% code coverage
- **Framework**: Jest + React Native Testing Library
- **Test Types**: Component tests, utility functions, business logic
- **Mocking**: API calls, native modules, external services

### Integration Testing
- **Database Operations**: CRUD operations, migrations, sync
- **Authentication Flow**: Sign-in, sign-up, password reset
- **Payment Flow**: Purchase, restore, subscription management
- **Offline Functionality**: Data persistence, sync queue

### End-to-End Testing
- **Framework**: Detox (React Native)
- **Test Scenarios**: Complete user journeys
- **Platforms**: iOS Simulator, Android Emulator
- **CI Integration**: Automated testing on pull requests

### Performance Testing
- **Load Testing**: Large datasets, concurrent operations
- **Memory Testing**: Memory leaks, garbage collection
- **Battery Testing**: Background usage, sync operations
- **Network Testing**: Poor connectivity, offline scenarios

## Deployment Specifications

### Build Configuration
```javascript
// Metro configuration
module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
    resolver: {
        alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@services': './src/services',
            '@utils': './src/utils',
        },
    },
};

// Build variants
const BUILD_VARIANTS = {
    development: {
        apiUrl: 'https://dev-api.quicknotes.app',
        firebaseConfig: 'dev-firebase-config',
        enableLogging: true,
        enableDebugging: true,
    },
    staging: {
        apiUrl: 'https://staging-api.quicknotes.app',
        firebaseConfig: 'staging-firebase-config',
        enableLogging: true,
        enableDebugging: false,
    },
    production: {
        apiUrl: 'https://api.quicknotes.app',
        firebaseConfig: 'prod-firebase-config',
        enableLogging: false,
        enableDebugging: false,
    },
};
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: Build and Deploy
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run type-check

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: cd ios && pod install
      - run: npx react-native build-ios --mode Release

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions/setup-java@v3
      - run: npm ci
      - run: npx react-native build-android --mode Release
```

### Release Management
- **Version Strategy**: Semantic versioning (MAJOR.MINOR.PATCH)
- **Release Channels**: Alpha → Beta → Production
- **Rollout Strategy**: Gradual rollout (10% → 50% → 100%)
- **Rollback Plan**: Automated rollback on critical issues

This technical specification provides the detailed foundation for implementing the Quick Notes App according to the PRD requirements.
