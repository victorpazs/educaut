# Diagrama ER - Educaut

```mermaid
erDiagram
    users ||--o{ school_users : "tem"
    schools ||--o{ school_users : "tem"
    schools ||--o{ students : "possui"
    schools ||--o{ activities : "possui"
    schools ||--o{ schedules : "possui"
    schools ||--o{ files : "possui"
    schools ||--o{ attributes : "possui"
    schools ||--|| users : "criado_por"
    
    attribute_types ||--o{ attributes : "classifica"
    
    students ||--o{ student_attributes : "tem"
    attributes ||--o{ student_attributes : "aplicado_em"
    
    schedules ||--o{ schedules_students : "inclui"
    students ||--o{ schedules_students : "participa"
    
    schedules ||--o{ schedules_activities : "contém"
    activities ||--o{ schedules_activities : "usada_em"
    
    users {
        int id PK
        string name
        string email UK
        string password_hash
        datetime created_at
        string avatar
    }
    
    schools {
        int id PK
        int created_by FK
        string name
        datetime created_at
        int status
    }
    
    school_users {
        int id PK
        int school_id FK
        int user_id FK
        string role
        datetime created_at
    }
    
    students {
        int id PK
        int school_id FK
        string name
        string school_segment
        string description
        datetime created_at
        int status
        int school_year
        int tea_support_level
        boolean non_verbal
        datetime birthday
        string diagnosis
        string[] responsible
    }
    
    attribute_types {
        int id PK
        string name UK
    }
    
    attributes {
        int id PK
        int type_id FK
        string name
        int school_id FK
    }
    
    student_attributes {
        int student_id PK_FK
        int attribute_id PK_FK
    }
    
    activities {
        int id PK
        int school_id FK
        string name
        string description
        json content
        boolean is_public
        datetime created_at
        datetime updated_at
        int status
        string[] tags
    }
    
    schedules {
        int id PK
        int school_id FK
        string title
        string description
        datetime start_time
        datetime end_time
        datetime created_at
        int status
    }
    
    schedules_activities {
        int schedule_id PK_FK
        int activity_id PK_FK
        string note
        datetime created_at
        string[] images
    }
    
    schedules_students {
        int schedule_id PK_FK
        int student_id PK_FK
        datetime created_at
    }
    
    files {
        int id PK
        int school_id FK
        string type
        int size
        string url
        int status
        datetime created_at
    }
    
    activity_tags {
        string tag PK_UK
        string label UK
    }
```

## Descrição das Entidades

### Entidades Principais

1. **users** - Usuários do sistema
   - Armazena informações de autenticação e perfil dos usuários

2. **schools** - Escolas
   - Representa as instituições de ensino
   - Relaciona-se com o usuário que criou a escola

3. **students** - Estudantes
   - Informações dos alunos, incluindo dados pessoais, educacionais e de suporte

### Entidades de Relacionamento

4. **school_users** - Relacionamento N:N entre usuários e escolas
   - Define o papel (role) de cada usuário em cada escola

5. **student_attributes** - Relacionamento N:N entre estudantes e atributos
   - Permite associar múltiplos atributos a cada estudante

6. **schedules_students** - Relacionamento N:N entre agendamentos e estudantes
   - Define quais estudantes participam de cada agendamento

7. **schedules_activities** - Relacionamento N:N entre agendamentos e atividades
   - Associa atividades a agendamentos com notas e imagens

### Entidades de Suporte

8. **attribute_types** - Tipos de atributos
   - Classifica os diferentes tipos de atributos disponíveis

9. **attributes** - Atributos
   - Atributos que podem ser associados aos estudantes
   - Podem ser globais (school_id = 0) ou específicos de uma escola

10. **activities** - Atividades
    - Atividades educacionais criadas pelas escolas
    - Conteúdo armazenado em JSON

11. **schedules** - Agendamentos
    - Agendamentos de atividades com data/hora de início e fim

12. **files** - Arquivos
    - Arquivos associados às escolas

13. **activity_tags** - Tags de atividades
    - Tabela de referência para tags (sem relacionamento direto no schema)

## Relacionamentos Principais

- **users ↔ schools**: Um usuário pode criar múltiplas escolas (1:N)
- **users ↔ schools** (via school_users): Muitos-para-muitos com papel definido
- **schools ↔ students**: Uma escola possui múltiplos estudantes (1:N)
- **schools ↔ activities**: Uma escola possui múltiplas atividades (1:N)
- **schools ↔ schedules**: Uma escola possui múltiplos agendamentos (1:N)
- **students ↔ attributes**: Muitos-para-muitos via student_attributes
- **schedules ↔ students**: Muitos-para-muitos via schedules_students
- **schedules ↔ activities**: Muitos-para-muitos via schedules_activities

