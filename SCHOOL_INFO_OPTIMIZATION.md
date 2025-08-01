# School Info API Optimization

## Overview

The `api/school-info` endpoint is called on every page load and returns comprehensive school data including sessions, levels, programmes, faculties, departments, semesters, programme types, entry modes, countries, payment types, course categories, and configurations. This document outlines the optimization implemented to eliminate redundant API calls throughout the frontend.

## Problem

Previously, many components were making individual API calls to fetch data that was already available in the school_info response, leading to:
- Multiple unnecessary API requests
- Slower page load times
- Increased server load
- Redundant network traffic

## Solution

### 1. School Info Mixin (`src/mixins/schoolInfoMixin.js`)

Created a comprehensive mixin that provides easy access to all school info data through computed properties:

#### Basic School Information
- `schoolName` - Institution name
- `schoolShortName` - Institution abbreviation
- `schoolLogo` - Institution logo URL

#### Academic Data
- `schoolSessions` - All academic sessions
- `schoolLevels` - All academic levels (100, 200, 300, etc.)
- `schoolProgrammes` - All academic programmes
- `schoolFaculties` - All faculties
- `schoolDepartments` - All departments
- `schoolSemesters` - All semesters
- `schoolProgrammeTypes` - Programme types (Full Time, Part Time)
- `schoolEntryModes` - Entry modes (UTME, DE)
- `schoolCountries` - Available countries
- `schoolPaymentTypes` - Payment types
- `schoolCourseCategories` - Course categories

#### Configuration Helpers
- `currentSession` - Current academic session ID
- `currentSemester` - Current semester ID
- `currentApplicationSession` - Current application session ID
- `graduationMinCGPA` - Minimum CGPA for graduation
- `graduationLevelId` - Graduation level ID
- `graduationMinCreditUnits` - Minimum credit units for graduation

#### Feature Flags
- `isApplicantRegistrationEnabled()`
- `isAcceptanceFeeEnabled()`
- `isFacultyEnabled()`
- `isDepartmentEnabled()`
- `isEntryModeEnabled()`
- `isProgrammeTypeEnabled()`
- `isCourseRegistrationAllowed()`
- `arePaymentsAllowed()`
- `isJambRequiredForApplication()`

#### Photo Display Settings
- `showPhotoOnReceipt()`
- `showPhotoOnResultSlip()`
- `showPhotoOnInvoice()`
- `showPhotoOnCourseReg()`
- `showPhotoOnExamCard()`

#### Dropdown Helpers
- `sessionsForDropdown()` - Formatted for select dropdowns
- `levelsForDropdown()` - Formatted for select dropdowns
- `programmesForDropdown()` - Formatted for select dropdowns
- `facultiesForDropdown()` - Formatted for select dropdowns
- `departmentsForDropdown()` - Formatted for select dropdowns
- `semestersForDropdown()` - Formatted for select dropdowns
- `programmeTypesForDropdown()` - Formatted for select dropdowns
- `entryModesForDropdown()` - Formatted for select dropdowns
- `countriesForDropdown()` - Formatted for select dropdowns

#### Utility Methods
- `getConfigurationValue(name)` - Get configuration by name
- `getConfigurationBoolean(name)` - Get configuration as boolean
- `getSessionById(id)` - Find session by ID
- `getLevelById(id)` - Find level by ID
- `getProgrammeById(id)` - Find programme by ID
- `getFacultyById(id)` - Find faculty by ID
- `getDepartmentById(id)` - Find department by ID
- `getSemesterById(id)` - Find semester by ID
- `getProgrammesByFaculty(facultyId)` - Filter programmes by faculty
- `getProgrammesByDepartment(departmentId)` - Filter programmes by department
- `getProgrammesByType(typeId)` - Filter programmes by type
- `getDepartmentsByFaculty(facultyId)` - Filter departments by faculty
- `waitForSchoolInfo(maxWait)` - Wait for school info to load

### 2. Integration with User Data Mixin

The `schoolInfoMixin` is automatically included in the `userDataMixin`, making it available to all components that use the user data mixin.

### 3. Optimized Components

The following components have been optimized to use school info data instead of making individual API calls:

#### Staff Components
- `StaffCourseManagement.vue` - Uses `schoolSessions`
- `ResultInput.vue` - Uses `schoolSessions`, `schoolLevels`, `schoolProgrammes`
- `TranscriptGeneration.vue` - Uses `schoolSessions`
- `StudentManagement.vue` - Uses `schoolSessions`, `schoolLevels`, `schoolProgrammes`
- `ApplicantManagement.vue` - Uses `schoolSessions`, `schoolProgrammes`
- `BatchScoreInput.vue` - Uses `schoolSessions`, `schoolLevels`, `schoolProgrammes`
- `ScoreInput.vue` - Uses `schoolSessions`, `schoolLevels`, `schoolProgrammes`
- `ResultManagement.vue` - Uses `schoolSessions`, `schoolLevels`, `schoolProgrammes`
- `ResultComputation.vue` - Uses `schoolSessions`, `schoolLevels`, `schoolProgrammes`

#### Student Components
- `Results.vue` - Uses `schoolSessions`
- `Invoices.vue` - Uses `schoolSessions`

#### Sidebar Components
- `Staff/SideBar.vue` - Uses `schoolSessions`
- `Student/StudentSidebar.vue` - Uses `schoolSessions`

## Usage Examples

### Basic Usage in Components

```javascript
import { schoolInfoMixin } from '@/mixins/schoolInfoMixin';

export default {
    mixins: [schoolInfoMixin],
    
    async mounted() {
        // Wait for school info to be loaded
        await this.waitForSchoolInfo();
        
        // Use school info data
        this.sessions = this.schoolSessions;
        this.levels = this.schoolLevels;
        this.programmes = this.schoolProgrammes;
    }
}
```

### Using Configuration Values

```javascript
// Check if feature is enabled
if (this.isFacultyEnabled()) {
    // Show faculty selection
}

// Get current session
const currentSessionId = this.currentSession;

// Get graduation requirements
const minCGPA = this.graduationMinCGPA;
const minUnits = this.graduationMinCreditUnits;
```

### Using Dropdown Helpers

```javascript
// In template
<select v-model="selectedSession">
    <option v-for="session in sessionsForDropdown" 
            :key="session.value" 
            :value="session.value">
        {{ session.label }}
    </option>
</select>
```

### Finding Related Data

```javascript
// Get programmes for a specific faculty
const facultyProgrammes = this.getProgrammesByFaculty(facultyId);

// Get departments for a specific faculty
const facultyDepartments = this.getDepartmentsByFaculty(facultyId);

// Find specific items by ID
const session = this.getSessionById(sessionId);
const programme = this.getProgrammeById(programmeId);
```

## Benefits

1. **Reduced API Calls**: Eliminated dozens of redundant API requests across the application
2. **Faster Page Loads**: Components load faster by using cached data
3. **Improved Performance**: Reduced server load and network traffic
4. **Better User Experience**: Faster, more responsive interface
5. **Consistent Data**: All components use the same data source
6. **Easier Maintenance**: Centralized data access patterns

## Migration Guide

To migrate existing components:

1. Add the `schoolInfoMixin` to your component (or use `userDataMixin` which includes it)
2. Replace individual API calls with school info data
3. Use `await this.waitForSchoolInfo()` if you need to ensure data is loaded
4. Use the provided computed properties and helper methods

### Before (Inefficient)
```javascript
async loadSessions() {
    const response = await get(this.$endpoints.staff.getAllSessions.url);
    this.sessions = response.data;
}
```

### After (Optimized)
```javascript
async loadSessions() {
    await this.waitForSchoolInfo();
    this.sessions = this.schoolSessions;
}
```

## Configuration Usage

The school info includes a comprehensive configuration system. Use the helper methods to access configuration values:

```javascript
// Boolean configurations
const isRegistrationOpen = this.isCourseRegistrationAllowed();
const arePaymentsEnabled = this.arePaymentsAllowed();

// String/Number configurations
const defaultPassword = this.getConfigurationValue('default_password');
const currentSession = this.currentSession;
const minCGPA = this.graduationMinCGPA;
```

This optimization significantly improves the application's performance while maintaining all existing functionality.
