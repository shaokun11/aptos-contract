module self::demo111 {

    use aptos_std::simple_map::{Self, SimpleMap};
    use std::string::String;

    #[view]
    public fun sum(a: u64, b :u64):u64  {
        return (a + b)
    }

    struct Table has key, store {
        table: SimpleMap<String,String>
    }

    struct Counter has key {
        count: u64
    }

    fun init_module(resource_signer: &signer) {
        move_to(resource_signer, Counter {
                count:0
        });
        let map = simple_map::create();
        move_to(resource_signer, Table {
            table:map
        });
    }


    #[view]
    public fun get_value(key: String): String acquires Table {
        let table = borrow_global<Table>(@self).table;
        *simple_map::borrow(&table, &key)
    }

    #[view]
    public fun exist_key(key:String): bool acquires Table {
        let table = borrow_global<Table>(@self).table;
        simple_map::contains_key(&table,&key)
    }


    #[view]
    public fun get_counter(): u64 acquires Counter {
        borrow_global<Counter>(@self).count
    }

    public entry fun set_value(key:String,value:String) acquires Table {
        let acc_resource =  borrow_global_mut<Table>(@self);
        let table = &mut acc_resource.table;
        if (simple_map::contains_key(table, &key)) {
            let curr_value = simple_map::borrow_mut(table, &key);
            *curr_value = value;
        } else {
            simple_map::add(table, key, value);
        };
    }

    public entry fun increase(_account: signer) acquires Counter {
        let old_count = borrow_global_mut<Counter>(@self);
        old_count.count = old_count.count + 1;
    }

}

