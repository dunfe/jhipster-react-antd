/**
 * Copyright 2013-2021 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const constants = require('generator-jhipster/generators/generator-constants');

/* Constants use throughout */
const { CLIENT_TEST_SRC_DIR, REACT_DIR } = constants;
const { REACT } = constants.SUPPORTED_CLIENT_FRAMEWORKS;

const CLIENT_REACT_TEMPLATES_DIR = 'react';

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */

const reactFiles = {
    client: [
        {
            condition: generator => !generator.embedded,
            path: REACT_DIR,
            templates: [
                {
                    file: 'entities/entity-detail.tsx',
                    method: 'processJsx',
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}-detail.tsx`
                },
                {
                    file: 'entities/entity.tsx',
                    method: 'processJsx',
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}.tsx`
                },
                {
                    file: 'entities/entity.reducer.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}.reducer.ts`
                },
                {
                    file: 'entities/index.tsx',
                    method: 'processJsx',
                    renameTo: generator => `entities/${generator.entityFolderName}/index.tsx`
                }
            ]
        },
        {
            path: REACT_DIR,
            templates: [
                {
                    file: 'entities/entity.model.ts',
                    renameTo: generator => `shared/model/${generator.entityModelFileName}.model.ts`
                }
            ]
        },
        {
            condition: generator => !generator.readOnly && !generator.embedded,
            path: REACT_DIR,
            templates: [
                {
                    file: 'entities/entity-delete-dialog.tsx',
                    method: 'processJsx',
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}-delete-dialog.tsx`
                },
                {
                    file: 'entities/entity-update.tsx',
                    method: 'processJsx',
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}-update.tsx`
                }
            ]
        }
    ],
    test: [
        {
            condition: generator => !generator.embedded,
            path: REACT_DIR,
            templates: [
                {
                    file: 'entities/entity-reducer.spec.ts',
                    renameTo: generator => `entities/${generator.entityFolderName}/${generator.entityFileName}-reducer.spec.ts`
                }
            ]
        },
        {
            condition: generator => generator.protractorTests && !generator.embedded,
            path: CLIENT_TEST_SRC_DIR,
            templates: [
                {
                    file: 'e2e/entities/entity-page-object.ts',
                    renameTo: generator => `e2e/entities/${generator.entityFolderName}/${generator.entityFileName}.page-object.ts`
                },
                {
                    file: 'e2e/entities/entity.spec.ts',
                    renameTo: generator => `e2e/entities/${generator.entityFolderName}/${generator.entityFileName}.spec.ts`
                }
            ]
        },
        {
            condition: generator => generator.protractorTests && !generator.readOnly && !generator.embedded,
            path: CLIENT_TEST_SRC_DIR,
            templates: [
                {
                    file: 'e2e/entities/entity-update-page-object.ts',
                    renameTo: generator => `e2e/entities/${generator.entityFolderName}/${generator.entityFileName}-update.page-object.ts`
                }
            ]
        }
    ]
};

module.exports = {
    writeFiles,
    reactFiles
};

function addSampleRegexTestingStrings(generator) {
    generator.fields.forEach(field => {
        if (field.fieldValidateRulesPattern !== undefined) {
            const randExp = field.createRandexp();
            field.fieldValidateSampleString = randExp.gen();
            field.fieldValidateModifiedString = randExp.gen();
        }
    });
}

function writeFiles() {
    return {
        writeClientFiles() {
            if (
                this.skipClient ||
                (this.jhipsterConfig.microfrontend && this.jhipsterConfig.applicationType === 'gateway' && this.microserviceName)
            )
                return undefined;
            if (this.protractorTests) {
                addSampleRegexTestingStrings(this);
            }

            let files;
            let clientMainSrcDir;
            let templatesDir;

            if (this.clientFramework === REACT) {
                files = reactFiles;
                clientMainSrcDir = REACT_DIR;
                templatesDir = CLIENT_REACT_TEMPLATES_DIR;
            }

            if (!files) return undefined;

            return this.writeFilesToDisk(files, templatesDir);
        }
    };
}
