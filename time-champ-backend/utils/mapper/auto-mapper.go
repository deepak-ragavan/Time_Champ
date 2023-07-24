package mapper

import (
	"fmt"
	"reflect"
	"github.com/tracker/pkg/constant"
)

func Map(source, dest interface{}) {
	var destType = reflect.TypeOf(dest)
	if destType.Kind() != reflect.Ptr {
		panic("Dest must be a pointer type")
	}
	var sourceVal = reflect.ValueOf(source)
	var destVal = reflect.ValueOf(dest).Elem()
	mapValues(sourceVal, destVal, false)
}

func MapLoose(source, dest interface{}) {
	var destType = reflect.TypeOf(dest)
	if destType.Kind() != reflect.Ptr {
		panic("Dest must be a pointer type")
	}
	var sourceVal = reflect.ValueOf(source)
	var destVal = reflect.ValueOf(dest).Elem()
	mapValues(sourceVal, destVal, true)
}

func mapValues(sourceVal, destVal reflect.Value, loose bool) {
	destType := destVal.Type()
	if destType.Kind() == reflect.Struct {
		if sourceVal.Type().Kind() == reflect.Ptr {
			if sourceVal.IsNil() {
				// If source is nil, it maps to an empty struct
				sourceVal = reflect.New(sourceVal.Type().Elem())
			}
			sourceVal = sourceVal.Elem()
		}
		for i := 0; i < destVal.NumField(); i++ {
			mapField(sourceVal, destVal, i, loose)
		}
	} else if destType == sourceVal.Type() {
		destVal.Set(sourceVal)
	} else if destType.Kind() == reflect.Ptr {
		if valueIsNil(sourceVal) {
			return
		}
		val := reflect.New(destType.Elem())
		mapValues(sourceVal, val.Elem(), loose)
		destVal.Set(val)
	} else if destType.Kind() == reflect.Slice {
		mapSlice(sourceVal, destVal, loose)
	} else {
		panic("Currently not supported")
	}
}

func mapSlice(sourceVal, destVal reflect.Value, loose bool) {
	destType := destVal.Type()
	length := sourceVal.Len()
	target := reflect.MakeSlice(destType, length, length)
	for j := 0; j < length; j++ {
		val := reflect.New(destType.Elem()).Elem()
		mapValues(sourceVal.Index(j), val, loose)
		target.Index(j).Set(val)
	}
	if length == constant.ZERO {
		verifyArrayTypesAreCompatible(sourceVal, destVal, loose)
	}
	destVal.Set(target)
}

func verifyArrayTypesAreCompatible(sourceVal, destVal reflect.Value, loose bool) {
	dummyDest := reflect.New(reflect.PtrTo(destVal.Type()))
	dummySource := reflect.MakeSlice(sourceVal.Type(), 1, 1)
	mapValues(dummySource, dummyDest.Elem(), loose)
}

func mapField(source, destVal reflect.Value, i int, loose bool) {
	destType := destVal.Type()
	fieldName := destType.Field(i).Name
	defer func() {
		if r := recover(); r != nil {
			panic(fmt.Sprintf("Error mapping field: %s. DestType: %v. SourceType: %v. Error: %v", fieldName, destType, source.Type(), r))
		}
	}()

	destField := destVal.Field(i)
	if destType.Field(i).Anonymous {
		mapValues(source, destField, loose)
	} else {
		if valueIsContainedInNilEmbeddedType(source, fieldName) {
			return
		}
		sourceField := source.FieldByName(fieldName)
		if (sourceField == reflect.Value{}) {
			if loose {
				return
			}
			if destField.Kind() == reflect.Struct {
				mapValues(source, destField, loose)
				return
			} else {
				for i := 0; i < source.NumField(); i++ {
					if source.Field(i).Kind() != reflect.Struct {
						continue
					}
					if sourceField = source.Field(i).FieldByName(fieldName); (sourceField != reflect.Value{}) {
						break
					}
				}
			}
		}
		mapValues(sourceField, destField, loose)
	}
}

func valueIsNil(value reflect.Value) bool {
	return value.Type().Kind() == reflect.Ptr && value.IsNil()
}

func valueIsContainedInNilEmbeddedType(source reflect.Value, fieldName string) bool {
	structField, _ := source.Type().FieldByName(fieldName)
	ix := structField.Index
	if len(structField.Index) > 1 {
		parentField := source.FieldByIndex(ix[:len(ix)-1])
		if valueIsNil(parentField) {
			return true
		}
	}
	return false
}
